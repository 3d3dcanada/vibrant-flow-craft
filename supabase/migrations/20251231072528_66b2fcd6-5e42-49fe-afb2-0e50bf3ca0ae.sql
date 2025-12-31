-- Create update_updated_at function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create status enums
CREATE TYPE public.print_request_status AS ENUM ('pending', 'claimed', 'quoted', 'accepted', 'declined', 'cancelled');
CREATE TYPE public.print_job_status AS ENUM ('new', 'printing', 'post_processing', 'ready', 'shipped', 'complete', 'cancelled');
CREATE TYPE public.printer_status AS ENUM ('available', 'printing', 'maintenance', 'offline');
CREATE TYPE public.printer_connection_type AS ENUM ('none', 'octoprint', 'moonraker');
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'completed', 'rejected');
CREATE TYPE public.filament_dry_status AS ENUM ('dry', 'needs_drying', 'unknown');

-- Print Requests table
CREATE TABLE public.print_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  maker_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.print_request_status NOT NULL DEFAULT 'pending',
  specs JSONB DEFAULT '{}',
  attribution JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Print Jobs table
CREATE TABLE public.print_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.print_requests(id) ON DELETE SET NULL,
  maker_id UUID NOT NULL,
  status public.print_job_status NOT NULL DEFAULT 'new',
  sla_target_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  photos JSONB DEFAULT '[]',
  quality_checks JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Maker Printers table
CREATE TABLE public.maker_printers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maker_id UUID NOT NULL,
  model TEXT NOT NULL,
  nozzle_sizes TEXT[] DEFAULT ARRAY['0.4'],
  job_size TEXT DEFAULT 'medium',
  materials_supported TEXT[] DEFAULT ARRAY['PLA'],
  status public.printer_status NOT NULL DEFAULT 'available',
  notes TEXT,
  connection_type public.printer_connection_type DEFAULT 'none',
  connection_url TEXT,
  api_key TEXT,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  last_status JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Maker Filament Inventory
CREATE TABLE public.maker_filament (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maker_id UUID NOT NULL,
  material TEXT NOT NULL,
  color TEXT NOT NULL,
  brand TEXT,
  grams_remaining INTEGER DEFAULT 1000,
  dry_status public.filament_dry_status DEFAULT 'unknown',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payout Requests
CREATE TABLE public.payout_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maker_id UUID NOT NULL,
  amount_estimate NUMERIC(10,2) NOT NULL DEFAULT 0,
  status public.payout_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.print_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maker_printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maker_filament ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- RLS for print_requests
CREATE POLICY "Users can view own requests" ON public.print_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Makers can view claimed requests" ON public.print_requests
  FOR SELECT USING (auth.uid() = maker_id);

CREATE POLICY "Makers can view pending requests" ON public.print_requests
  FOR SELECT USING (status = 'pending' AND maker_id IS NULL);

CREATE POLICY "Anyone can create requests" ON public.print_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Makers can claim requests" ON public.print_requests
  FOR UPDATE USING (
    (status = 'pending' AND maker_id IS NULL) OR
    (auth.uid() = maker_id)
  );

-- RLS for print_jobs
CREATE POLICY "Makers can view own jobs" ON public.print_jobs
  FOR SELECT USING (auth.uid() = maker_id);

CREATE POLICY "Makers can create jobs" ON public.print_jobs
  FOR INSERT WITH CHECK (auth.uid() = maker_id);

CREATE POLICY "Makers can update own jobs" ON public.print_jobs
  FOR UPDATE USING (auth.uid() = maker_id);

-- RLS for maker_printers
CREATE POLICY "Makers can view own printers" ON public.maker_printers
  FOR SELECT USING (auth.uid() = maker_id);

CREATE POLICY "Makers can create printers" ON public.maker_printers
  FOR INSERT WITH CHECK (auth.uid() = maker_id);

CREATE POLICY "Makers can update own printers" ON public.maker_printers
  FOR UPDATE USING (auth.uid() = maker_id);

CREATE POLICY "Makers can delete own printers" ON public.maker_printers
  FOR DELETE USING (auth.uid() = maker_id);

-- RLS for maker_filament
CREATE POLICY "Makers can view own filament" ON public.maker_filament
  FOR SELECT USING (auth.uid() = maker_id);

CREATE POLICY "Makers can create filament" ON public.maker_filament
  FOR INSERT WITH CHECK (auth.uid() = maker_id);

CREATE POLICY "Makers can update own filament" ON public.maker_filament
  FOR UPDATE USING (auth.uid() = maker_id);

CREATE POLICY "Makers can delete own filament" ON public.maker_filament
  FOR DELETE USING (auth.uid() = maker_id);

-- RLS for payout_requests
CREATE POLICY "Makers can view own payouts" ON public.payout_requests
  FOR SELECT USING (auth.uid() = maker_id);

CREATE POLICY "Makers can create payouts" ON public.payout_requests
  FOR INSERT WITH CHECK (auth.uid() = maker_id);

-- Triggers for updated_at
CREATE TRIGGER update_print_requests_updated_at
  BEFORE UPDATE ON public.print_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_print_jobs_updated_at
  BEFORE UPDATE ON public.print_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maker_printers_updated_at
  BEFORE UPDATE ON public.maker_printers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maker_filament_updated_at
  BEFORE UPDATE ON public.maker_filament
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();