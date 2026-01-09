// Verify Stripe Checkout Session Edge Function
// Verifies payment status and updates order to paid
// Date: 2026-01-09

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

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
        // Check for Stripe secret key
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            return new Response(
                JSON.stringify({
                    error: 'Stripe is not configured',
                    code: 'STRIPE_NOT_CONFIGURED'
                }),
                { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Initialize Stripe
        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        });

        // Parse request body
        const { session_id, order_id } = await req.json();

        if (!session_id || !order_id) {
            return new Response(
                JSON.stringify({ error: 'session_id and order_id are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Get auth user from request
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Authorization required' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Initialize Supabase client with user's auth
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        });

        // Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return new Response(
                JSON.stringify({ error: 'Invalid authentication' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Fetch order - verify ownership
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', order_id)
            .eq('user_id', user.id)
            .single();

        if (orderError || !order) {
            return new Response(
                JSON.stringify({ error: 'Order not found or access denied' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Verify session ID matches order
        if (order.stripe_checkout_session_id !== session_id) {
            return new Response(
                JSON.stringify({ error: 'Session ID does not match order' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Already paid - return success
        if (order.status === 'paid') {
            return new Response(
                JSON.stringify({
                    verified: true,
                    status: 'paid',
                    message: 'Payment already confirmed'
                }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Verify metadata matches
        if (session.metadata?.order_id !== order_id) {
            return new Response(
                JSON.stringify({ error: 'Session metadata mismatch' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Check payment status
        if (session.payment_status !== 'paid') {
            return new Response(
                JSON.stringify({
                    verified: false,
                    status: session.payment_status,
                    message: 'Payment not completed'
                }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Payment is confirmed - update order
        const now = new Date().toISOString();
        const statusHistory = order.status_history || [];
        statusHistory.push({
            status: 'paid',
            timestamp: now,
            source: 'stripe_verification',
        });

        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: 'paid',
                payment_confirmed_at: now,
                stripe_payment_intent_id: session.payment_intent,
                status_history: statusHistory,
            })
            .eq('id', order_id);

        if (updateError) {
            console.error('Failed to update order:', updateError);
            return new Response(
                JSON.stringify({ error: 'Failed to update order status' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                verified: true,
                status: 'paid',
                message: 'Payment confirmed successfully'
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Verification error:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Failed to verify payment' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
