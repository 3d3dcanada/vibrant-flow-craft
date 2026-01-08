-- Migration: Create quotes table for multi-quote management
-- Date: 2026-01-07
-- Author: Agent B

-- Create quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest quotes
  
  -- File metadata
  file_name TEXT,
  file_volume_cm3 DECIMAL(10,3),
  file_weight_grams DECIMAL(10,2),
  file_surface_area_cm2 DECIMAL(10,2),
  
  -- Configuration
  material TEXT NOT NULL,
  quality TEXT NOT NULL CHECK (quality IN ('draft', 'standard', 'high')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  color TEXT,
  post_processing_config JSONB,
  delivery_speed TEXT NOT NULL DEFAULT 'standard' CHECK (delivery_speed IN ('standard', 'emergency')),
  
  -- Pricing breakdown (stored as JSONB for flexibility)
  price_breakdown JSONB NOT NULL,
  total_cad DECIMAL(10,2) NOT NULL CHECK (total_cad >= 0),
  total_credits INTEGER NOT NULL CHECK (total_credits >= 0),
  
  -- Maker payout
  maker_payout JSONB NOT NULL,
  
  -- Metadata
  estimated_print_time_hours DECIMAL(6,2),
  dfm_warnings JSONB,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'ordered', 'archived')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Constraints
  CHECK (user_id IS NOT NULL OR session_id IS NOT NULL) -- Must have either user_id or session_id
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON public.quotes(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quotes_session_id ON public.quotes(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_expires_at ON public.quotes(expires_at);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at DESC);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own quotes (by user_id or session_id)
CREATE POLICY "Users can view own quotes" 
  ON public.quotes 
  FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR session_id = current_setting('app.session_id', true)
  );

-- Users can create quotes
CREATE POLICY "Users can create quotes" 
  ON public.quotes 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id 
    OR session_id IS NOT NULL
  );

-- Users can update their own quotes
CREATE POLICY "Users can update own quotes" 
  ON public.quotes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Admins can view all quotes
CREATE POLICY "Admins can view all quotes" 
  ON public.quotes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Admins can update all quotes
CREATE POLICY "Admins can update all quotes" 
  ON public.quotes 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_quotes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_quotes_update
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_quotes_updated_at();

-- Rollback script
-- DROP TRIGGER IF EXISTS on_quotes_update ON public.quotes;
-- DROP FUNCTION IF EXISTS public.update_quotes_updated_at();
-- DROP POLICY IF EXISTS "Admins can update all quotes" ON public.quotes;
-- DROP POLICY IF EXISTS "Admins can view all quotes" ON public.quotes;
-- DROP POLICY IF EXISTS "Users can update own quotes" ON public.quotes;
-- DROP POLICY IF EXISTS "Users can create quotes" ON public.quotes;
-- DROP POLICY IF EXISTS "Users can view own quotes" ON public.quotes;
-- DROP INDEX IF EXISTS idx_quotes_created_at;
-- DROP INDEX IF EXISTS idx_quotes_expires_at;
-- DROP INDEX IF EXISTS idx_quotes_status;
-- DROP INDEX IF EXISTS idx_quotes_session_id;
-- DROP INDEX IF EXISTS idx_quotes_user_id;
-- DROP TABLE IF EXISTS public.quotes;
