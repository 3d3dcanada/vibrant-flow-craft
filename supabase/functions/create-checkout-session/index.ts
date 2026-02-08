// Create Stripe Checkout Session Edge Function
// Creates a Stripe Checkout Session for an order and returns the URL
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
                    error: 'Stripe is not configured. Card payments are unavailable.',
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
        const { order_id } = await req.json();

        if (!order_id) {
            return new Response(
                JSON.stringify({ error: 'order_id is required' }),
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

        // Validate order status
        if (order.status !== 'pending_payment') {
            return new Response(
                JSON.stringify({ error: `Cannot process payment for order with status: ${order.status}` }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Get site URL for redirects
        const siteUrl = Deno.env.get('SITE_URL') || 'https://3d3d.ca';

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'cad',
                        product_data: {
                            name: `3D Print Order (${order.order_number})`,
                            description: `Material: ${order.quote_snapshot?.material || 'N/A'}, Qty: ${order.quote_snapshot?.quantity || 1}`,
                        },
                        unit_amount: Math.round(order.total_cad * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                order_id: order.id,
                user_id: user.id,
                quote_id: order.quote_id || '',
                order_number: order.order_number,
            },
            success_url: `${siteUrl}/order/${order.id}?stripe_success=1&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/checkout/${order.quote_id}?stripe_cancel=1`,
            customer_email: user.email,
        });

        // Update order with Stripe session ID
        await supabase
            .from('orders')
            .update({ stripe_checkout_session_id: session.id })
            .eq('id', order.id);

        return new Response(
            JSON.stringify({
                checkout_url: session.url,
                session_id: session.id
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Checkout session error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
