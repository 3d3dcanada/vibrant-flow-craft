import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PrinterStatus {
  connected: boolean;
  state: 'idle' | 'printing' | 'paused' | 'offline' | 'error';
  progress?: number;
  temps?: {
    bed?: number;
    hotend?: number;
  };
  error?: string;
}

async function checkOctoPrint(url: string, apiKey: string): Promise<PrinterStatus> {
  try {
    console.log(`Checking OctoPrint at ${url}`);
    
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
    
    let state: PrinterStatus['state'] = 'idle';
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
    let temps: PrinterStatus['temps'];
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
    console.error('OctoPrint check failed:', err);
    return { connected: false, state: 'offline', error: err?.message || 'Connection failed' };
  }
}

async function checkMoonraker(url: string): Promise<PrinterStatus> {
  try {
    console.log(`Checking Moonraker at ${url}`);
    
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
    
    let state: PrinterStatus['state'] = 'idle';
    let progress: number | undefined;
    let temps: PrinterStatus['temps'];
    
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
    console.error('Moonraker check failed:', err);
    return { connected: false, state: 'offline', error: err?.message || 'Connection failed' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { printer_id } = await req.json();
    
    if (!printer_id) {
      return new Response(
        JSON.stringify({ error: 'printer_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching printer ${printer_id}`);
    
    // Fetch printer details
    const { data: printer, error: fetchError } = await supabase
      .from('maker_printers')
      .select('*')
      .eq('id', printer_id)
      .single();

    if (fetchError || !printer) {
      console.error('Printer fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Printer not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    let status: PrinterStatus;

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

    // Update printer record
    const { error: updateError } = await supabase
      .from('maker_printers')
      .update({
        last_seen_at: new Date().toISOString(),
        last_status: status,
        status: status.connected 
          ? (status.state === 'printing' ? 'printing' : 'available')
          : 'offline'
      })
      .eq('id', printer_id);

    if (updateError) {
      console.error('Failed to update printer:', updateError);
    }

    console.log(`Printer ${printer_id} status:`, status);

    return new Response(
      JSON.stringify(status),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in printer-status:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
