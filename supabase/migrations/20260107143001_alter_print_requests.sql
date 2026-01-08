-- Migration: Alter print_requests table to link to quotes
-- Date: 2026-01-07
-- Author: Agent B

-- Add new columns to print_requests table
ALTER TABLE public.print_requests
ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS file_volume_cm3 DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS file_weight_grams DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS dfm_warnings JSONB,
ADD COLUMN IF NOT EXISTS reorder_of_request_id UUID REFERENCES public.print_requests(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_print_requests_quote_id ON public.print_requests(quote_id) WHERE quote_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_print_requests_reorder_of ON public.print_requests(reorder_of_request_id) WHERE reorder_of_request_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.print_requests.quote_id IS 'Reference to the quote that was used to create this print request';
COMMENT ON COLUMN public.print_requests.file_volume_cm3 IS 'Calculated volume of the 3D model in cubic centimeters';
COMMENT ON COLUMN public.print_requests.file_weight_grams IS 'Estimated weight of the print in grams';
COMMENT ON COLUMN public.print_requests.dfm_warnings IS 'Design for Manufacturability warnings (e.g., thin walls, overhangs)';
COMMENT ON COLUMN public.print_requests.reorder_of_request_id IS 'If this is a reorder, reference to the original print request';

-- Rollback script
-- DROP INDEX IF EXISTS idx_print_requests_reorder_of;
-- DROP INDEX IF EXISTS idx_print_requests_quote_id;
-- ALTER TABLE public.print_requests DROP COLUMN IF EXISTS reorder_of_request_id;
-- ALTER TABLE public.print_requests DROP COLUMN IF EXISTS dfm_warnings;
-- ALTER TABLE public.print_requests DROP COLUMN IF EXISTS file_weight_grams;
-- ALTER TABLE public.print_requests DROP COLUMN IF EXISTS file_volume_cm3;
-- ALTER TABLE public.print_requests DROP COLUMN IF EXISTS quote_id;
