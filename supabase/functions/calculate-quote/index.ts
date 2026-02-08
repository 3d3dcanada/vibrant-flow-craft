// Calculate Quote Edge Function
// Provides server-side quote calculation with validation and persistence
// Date: 2026-01-07

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { QuoteRequest, QuoteResponse } from '../_shared/types.ts';
import { calculateQuote, calculateWeightFromVolume } from '../_shared/pricing.ts';
import { DESIGNER_ROYALTY_INCLUDED, MATERIAL_RATES } from '../_shared/constants.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Parse request body
        const requestData: QuoteRequest = await req.json();

        // Validate required fields
        if (!requestData.material || !requestData.quality || !requestData.quantity) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: material, quality, quantity' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Validate quantity
        if (requestData.quantity < 1 || requestData.quantity > 1000) {
            return new Response(
                JSON.stringify({ error: 'Quantity must be between 1 and 1000' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Calculate weight from volume or use provided grams
        let grams: number;
        if (requestData.file_metadata?.volume_cm3) {
            grams = calculateWeightFromVolume(requestData.file_metadata.volume_cm3, requestData.material);
        } else if (requestData.grams) {
            grams = requestData.grams;
        } else {
            return new Response(
                JSON.stringify({ error: 'Either file_metadata.volume_cm3 or grams must be provided' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Validate minimum grams (ensure filament cost >= $3)
        const minGrams = Math.ceil(3.00 / MATERIAL_RATES[requestData.material].customerRate);
        if (grams < minGrams) {
            return new Response(
                JSON.stringify({
                    error: `Minimum ${minGrams}g required for ${MATERIAL_RATES[requestData.material].name}`
                }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Calculate quote
        const { breakdown, makerPayout, estimatedPrintTimeHours } = calculateQuote({
            material: requestData.material,
            grams,
            quantity: requestData.quantity,
            deliverySpeed: requestData.delivery_speed,
            rushRate: requestData.rush_rate,
            postProcessing: requestData.post_processing?.enabled
                ? {
                    tier: requestData.post_processing.tier || 'standard',
                    minutes: requestData.post_processing.minutes || 0,
                }
                : undefined,
        });

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get user ID from auth header (if authenticated)
        const authHeader = req.headers.get('Authorization');
        let userId: string | null = null;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user } } = await supabase.auth.getUser(token);
            userId = user?.id || null;
        }

        // Generate session ID for guest quotes (if not authenticated)
        const sessionId = userId ? null : crypto.randomUUID();

        // Calculate expiration (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Store quote in database
        const { data: quote, error: dbError } = await supabase
            .from('quotes')
            .insert({
                user_id: userId,
                session_id: sessionId,
                file_name: requestData.file_metadata ? 'uploaded-file.stl' : null,
                file_volume_cm3: requestData.file_metadata?.volume_cm3 || null,
                file_weight_grams: grams,
                file_surface_area_cm2: requestData.file_metadata?.surface_area_cm2 || null,
                material: requestData.material,
                quality: requestData.quality,
                quantity: requestData.quantity,
                color: requestData.color || null,
                post_processing_config: requestData.post_processing || null,
                delivery_speed: requestData.delivery_speed,
                price_breakdown: breakdown,
                total_cad: breakdown.total,
                total_credits: breakdown.total_credits,
                maker_payout: makerPayout,
                estimated_print_time_hours: estimatedPrintTimeHours,
                dfm_warnings: null, // TODO: Add DFM analysis in Phase 2
                expires_at: expiresAt.toISOString(),
                status: 'active',
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return new Response(
                JSON.stringify({ error: 'Failed to save quote', details: dbError.message }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Prepare response
        const response: QuoteResponse = {
            quote_id: quote.id,
            expires_at: quote.expires_at,
            breakdown,
            maker_payout: makerPayout,
            designer_royalty: DESIGNER_ROYALTY_INCLUDED,
            estimated_print_time_hours: estimatedPrintTimeHours,
            dfm_warnings: [], // TODO: Add DFM analysis in Phase 2
        };

        return new Response(
            JSON.stringify(response),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(
            JSON.stringify({ error: 'Internal server error', details: errorMessage }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
