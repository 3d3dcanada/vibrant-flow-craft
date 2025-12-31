import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Server-side reward constants - single source of truth
const RECYCLING_REWARDS = {
  MAX_GRAMS_PER_SUBMISSION: 50_000, // 50kg max
  MAX_SUBMISSIONS_PER_DAY: 3,
  POINTS_PER_GRAM: 1,
  ALLOWED_MATERIALS: ['PLA', 'PETG', 'ABS', 'TPU', 'Nylon', 'Resin', 'Mixed'],
};

const REWARD_LIMITS = {
  MAX_POINTS_PER_DAY: 2_000,
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Client with user auth for getting user ID
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service client for writes that bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing recycling drop for user: ${user.id}`);

    // Parse and validate input
    const body = await req.json();
    const { grams, material_type, location } = body;

    // Validate grams
    if (typeof grams !== 'number' || !Number.isInteger(grams) || grams <= 0) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', message: 'Grams must be a positive integer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (grams > RECYCLING_REWARDS.MAX_GRAMS_PER_SUBMISSION) {
      return new Response(
        JSON.stringify({ 
          error: 'Limit exceeded', 
          message: `Maximum ${RECYCLING_REWARDS.MAX_GRAMS_PER_SUBMISSION}g (${RECYCLING_REWARDS.MAX_GRAMS_PER_SUBMISSION / 1000}kg) per submission` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate material type
    const validatedMaterial = material_type || 'Mixed';
    if (!RECYCLING_REWARDS.ALLOWED_MATERIALS.includes(validatedMaterial)) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', message: 'Invalid material type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate location
    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', message: 'Location is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check daily submission limit
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const { count: todaySubmissions, error: countError } = await supabaseAdmin
      .from('recycling_drops')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString());

    if (countError) {
      console.error('Count error:', countError);
      return new Response(
        JSON.stringify({ error: 'Server error', message: 'Failed to check submission limits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if ((todaySubmissions || 0) >= RECYCLING_REWARDS.MAX_SUBMISSIONS_PER_DAY) {
      return new Response(
        JSON.stringify({ 
          error: 'Daily limit reached', 
          message: `Maximum ${RECYCLING_REWARDS.MAX_SUBMISSIONS_PER_DAY} recycling submissions per day` 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate points server-side
    let pointsToAward = grams * RECYCLING_REWARDS.POINTS_PER_GRAM;

    // Check daily points cap (across all point-earning activities)
    const { data: todayPoints, error: pointsError } = await supabaseAdmin
      .from('recycling_drops')
      .select('points_earned')
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString());

    if (pointsError) {
      console.error('Points query error:', pointsError);
    }

    const earnedToday = todayPoints?.reduce((sum, drop) => sum + (drop.points_earned || 0), 0) || 0;
    const remainingAllowance = REWARD_LIMITS.MAX_POINTS_PER_DAY - earnedToday;

    if (remainingAllowance <= 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Daily points cap reached', 
          message: `You've reached the maximum ${REWARD_LIMITS.MAX_POINTS_PER_DAY} points per day` 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clamp points if would exceed daily cap
    if (pointsToAward > remainingAllowance) {
      pointsToAward = remainingAllowance;
      console.log(`Clamped points from ${grams} to ${pointsToAward} due to daily cap`);
    }

    // Insert recycling drop with server-computed points
    const { data: drop, error: insertError } = await supabaseAdmin
      .from('recycling_drops')
      .insert({
        user_id: user.id,
        weight_grams: grams,
        material_type: validatedMaterial,
        location: location.trim(),
        points_earned: pointsToAward,
        verified: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Server error', message: 'Failed to record recycling drop' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Recycling drop recorded: ${grams}g = ${pointsToAward} points (pending verification)`);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        drop_id: drop.id,
        grams_recorded: grams,
        points_awarded: pointsToAward,
        message: `Submitted ${grams}g for verification. You'll earn ${pointsToAward} points when verified!`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error', message: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
