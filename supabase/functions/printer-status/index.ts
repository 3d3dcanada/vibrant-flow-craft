import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UUID v4 regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PrinterStatusResponse {
  connected: boolean;
  state: 'idle' | 'printing' | 'paused' | 'offline' | 'error';
  progress?: number;
  temps?: {
    bed?: number;
    hotend?: number;
  };
  last_seen_at?: string;
  error?: string;
}

async function checkOctoPrint(url: string, apiKey: string): Promise<PrinterStatusResponse> {
  try {
    console.log('Checking OctoPrint connection...');
    
    // Check version/connectivity
    const versionRes = await fetch(`${url}/api/version`, {
      headers: { 'X-Api-Key': apiKey },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!versionRes.ok) {
      if (versionRes.status === 401 || versionRes.status === 403) {
        return { connected: false, state: 'error', error: 'Invalid API key' };
      }
      return { connected: false, state: 'offline', error: `HTTP ${versionRes.status}` };
    }
    
    // Get job status
    const jobRes = await fetch(`${url}/api/job`, {
      headers: { 'X-Api-Key': apiKey },
      signal: AbortSignal.timeout(10000)
    });
    
    let state: PrinterStatusResponse['state'] = 'idle';
    let progress: number | undefined;
    
    if (jobRes.ok) {
      const jobData = await jobRes.json();
      if (jobData.state === 'Printing') {
        state = 'printing';
        progress = jobData.progress?.completion;
      } else if (jobData.state === 'Paused' || jobData.state === 'Pausing') {
        state = 'paused';
        progress = jobData.progress?.completion;
      }
    }
    
    // Get temps
    let temps: PrinterStatusResponse['temps'];
    try {
      const printerRes = await fetch(`${url}/api/printer`, {
        headers: { 'X-Api-Key': apiKey },
        signal: AbortSignal.timeout(10000)
      });
      if (printerRes.ok) {
        const printerData = await printerRes.json();
        temps = {
          bed: printerData.temperature?.bed?.actual,
          hotend: printerData.temperature?.tool0?.actual
        };
      }
    } catch {
      // Temps are optional
    }
    
    return { connected: true, state, progress, temps };
  } catch (err: any) {
    console.error('OctoPrint check failed:', err?.message);
    return { connected: false, state: 'offline', error: 'Connection failed' };
  }
}

async function checkMoonraker(url: string): Promise<PrinterStatusResponse> {
  try {
    console.log('Checking Moonraker connection...');
    
    // Check server info
    const infoRes = await fetch(`${url}/server/info`, {
      signal: AbortSignal.timeout(10000)
    });
    
    if (!infoRes.ok) {
      return { connected: false, state: 'offline', error: `HTTP ${infoRes.status}` };
    }
    
    // Get printer state
    const stateRes = await fetch(`${url}/printer/objects/query?print_stats&heater_bed&extruder`, {
      signal: AbortSignal.timeout(10000)
    });
    
    let state: PrinterStatusResponse['state'] = 'idle';
    let progress: number | undefined;
    let temps: PrinterStatusResponse['temps'];
    
    if (stateRes.ok) {
      const stateData = await stateRes.json();
      const printStats = stateData.result?.status?.print_stats;
      
      if (printStats?.state === 'printing') {
        state = 'printing';
        if (printStats.print_duration && printStats.total_duration) {
          progress = (printStats.print_duration / printStats.total_duration) * 100;
        }
      } else if (printStats?.state === 'paused') {
        state = 'paused';
      }
      
      temps = {
        bed: stateData.result?.status?.heater_bed?.temperature,
        hotend: stateData.result?.status?.extruder?.temperature
      };
    }
    
    return { connected: true, state, progress, temps };
  } catch (err: any) {
    console.error('Moonraker check failed:', err?.message);
    return { connected: false, state: 'offline', error: 'Connection failed' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // 1) REQUIRE AUTHENTICATED CALLER
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's JWT to get their identity
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    
    if (authError || !user) {
      console.log('Invalid or expired token:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;
    console.log(`Authenticated user: ${userId}`);

    // Parse and validate input
    const body = await req.json();
    const { printer_id } = body;
    
    // 4) VALIDATE PRINTER_ID IS UUID FORMAT
    if (!printer_id || typeof printer_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'printer_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!UUID_REGEX.test(printer_id)) {
      console.log(`Invalid UUID format: ${printer_id}`);
      return new Response(
        JSON.stringify({ error: 'Invalid printer_id format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role to fetch printer (bypasses RLS for ownership check)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // 2) VERIFY PRINTER OWNERSHIP BEFORE DOING ANYTHING
    const { data: printer, error: fetchError } = await supabaseAdmin
      .from('maker_printers')
      .select('id, maker_id, connection_type, connection_url, api_key')
      .eq('id', printer_id)
      .single();

    if (fetchError || !printer) {
      console.log('Printer not found:', fetchError?.message);
      return new Response(
        JSON.stringify({ error: 'Printer not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // CRITICAL: Verify the caller owns this printer
    if (printer.maker_id !== userId) {
      console.log(`Access denied: user ${userId} does not own printer ${printer_id} (owner: ${printer.maker_id})`);
      return new Response(
        JSON.stringify({ error: 'Access denied: you do not own this printer' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Ownership verified for printer ${printer_id}`);

    // Check if printer has connection configured
    if (printer.connection_type === 'none' || !printer.connection_url) {
      return new Response(
        JSON.stringify({ 
          connected: false, 
          state: 'offline', 
          error: 'No connection configured' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Perform status check
    let status: PrinterStatusResponse;

    if (printer.connection_type === 'octoprint') {
      if (!printer.api_key) {
        return new Response(
          JSON.stringify({ connected: false, state: 'error', error: 'API key required for OctoPrint' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      status = await checkOctoPrint(printer.connection_url, printer.api_key);
    } else if (printer.connection_type === 'moonraker') {
      status = await checkMoonraker(printer.connection_url);
    } else {
      status = { connected: false, state: 'offline', error: 'Unknown connection type' };
    }

    // Update printer record with latest status
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from('maker_printers')
      .update({
        last_seen_at: now,
        last_status: status,
        status: status.connected 
          ? (status.state === 'printing' ? 'printing' : 'available')
          : 'offline'
      })
      .eq('id', printer_id);

    if (updateError) {
      console.error('Failed to update printer:', updateError);
    }

    // 3) NEVER RETURN SECRETS - only return normalized status payload
    const safeResponse: PrinterStatusResponse = {
      connected: status.connected,
      state: status.state,
      progress: status.progress,
      temps: status.temps,
      last_seen_at: now,
      error: status.error
    };

    console.log(`Printer ${printer_id} status check complete: ${status.state}`);

    return new Response(
      JSON.stringify(safeResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in printer-status:', error?.message);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
