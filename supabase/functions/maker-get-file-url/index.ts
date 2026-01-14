// Phase 3F: Maker File Access - Secure Signed URL Generation (CORRECTED)
// Provides makers with time-limited signed URLs to download STL files for assigned orders

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  order_id: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Parse request body
    const { order_id }: RequestBody = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: 'order_id is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify maker is assigned to this order via maker_orders (CORRECTED)
    const { data: makerOrder, error: makerOrderError } = await supabase
      .from('maker_orders')
      .select('status, maker_id')
      .eq('order_id', order_id)
      .eq('maker_id', user.id)
      .single();

    if (makerOrderError || !makerOrder) {
      return new Response(
        JSON.stringify({ error: 'Order not assigned to you' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Maker can download file once assigned (no accept/decline check needed)
    // Status must be assigned, in_production, or shipped (not completed)
    if (!['assigned', 'in_production', 'shipped'].includes(makerOrder.status)) {
      return new Response(
        JSON.stringify({ error: 'File no longer available for this order status' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Get order to find file path
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('quote_id, quote_snapshot')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get quote to find file path
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('file_path, file_name')
      .eq('id', order.quote_id)
      .single();

    if (quoteError || !quote) {
      return new Response(
        JSON.stringify({ error: 'Quote not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (!quote.file_path) {
      return new Response(
        JSON.stringify({ error: 'File path not found in quote' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Generate signed URL (TTL = 10 minutes per spec)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('stl-uploads')
      .createSignedUrl(quote.file_path, 600); // 600 seconds = 10 minutes

    if (signedUrlError || !signedUrlData) {
      console.error('Signed URL error:', signedUrlError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate file access URL' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        signed_url: signedUrlData.signedUrl,
        file_name: quote.file_name,
        expires_in_seconds: 600
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in maker-get-file-url:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
