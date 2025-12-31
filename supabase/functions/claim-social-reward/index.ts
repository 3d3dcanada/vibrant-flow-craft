import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Server-side reward constants
const SOCIAL_REWARDS = {
  POINTS_PER_SHARE: 25,
  MAX_SHARES_PER_DAY: 3,
  ALLOWED_PLATFORMS: ['twitter', 'facebook', 'linkedin', 'instagram'],
  ALLOWED_SHARE_TYPES: ['print', 'referral', 'achievement', 'model'],
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

    // Create Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

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

    console.log(`Processing social reward claim for user: ${user.id}`);

    // Parse and validate input
    const body = await req.json();
    const { platform, share_type, reference_id } = body;

    // Validate platform
    if (!platform || !SOCIAL_REWARDS.ALLOWED_PLATFORMS.includes(platform.toLowerCase())) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          message: `Platform must be one of: ${SOCIAL_REWARDS.ALLOWED_PLATFORMS.join(', ')}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate share type
    if (!share_type || !SOCIAL_REWARDS.ALLOWED_SHARE_TYPES.includes(share_type.toLowerCase())) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          message: `Share type must be one of: ${SOCIAL_REWARDS.ALLOWED_SHARE_TYPES.join(', ')}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check daily share limit
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const { count: todayShares, error: countError } = await supabaseAdmin
      .from('social_shares')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString());

    if (countError) {
      console.error('Count error:', countError);
      return new Response(
        JSON.stringify({ error: 'Server error', message: 'Failed to check share limits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if ((todayShares || 0) >= SOCIAL_REWARDS.MAX_SHARES_PER_DAY) {
      return new Response(
        JSON.stringify({ 
          error: 'Daily limit reached', 
          message: `Maximum ${SOCIAL_REWARDS.MAX_SHARES_PER_DAY} social shares per day` 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for duplicate share (same platform + share_type within 24h)
    const { count: duplicateCount } = await supabaseAdmin
      .from('social_shares')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('platform', platform.toLowerCase())
      .eq('share_type', share_type.toLowerCase())
      .gte('created_at', todayStart.toISOString());

    if ((duplicateCount || 0) > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Duplicate share', 
          message: `You've already shared this type on ${platform} today` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate points server-side
    let pointsToAward = SOCIAL_REWARDS.POINTS_PER_SHARE;

    // Check daily points cap
    const { data: todayPoints } = await supabaseAdmin
      .from('social_shares')
      .select('points_earned')
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString());

    const earnedToday = todayPoints?.reduce((sum, share) => sum + (share.points_earned || 0), 0) || 0;
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
    }

    // Insert social share with server-computed points
    const { data: share, error: insertError } = await supabaseAdmin
      .from('social_shares')
      .insert({
        user_id: user.id,
        platform: platform.toLowerCase(),
        share_type: share_type.toLowerCase(),
        reference_id: reference_id || null,
        points_earned: pointsToAward,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Server error', message: 'Failed to record social share' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Social share recorded: ${platform} ${share_type} = ${pointsToAward} points`);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        share_id: share.id,
        points_awarded: pointsToAward,
        message: `Earned ${pointsToAward} points for sharing on ${platform}!`
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
