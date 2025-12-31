-- Add role and maker-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer' CHECK (role IN ('customer', 'maker')),
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS dry_box_required_ack boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS printer_models text,
ADD COLUMN IF NOT EXISTS nozzle_sizes text,
ADD COLUMN IF NOT EXISTS materials_supported text,
ADD COLUMN IF NOT EXISTS post_processing_capable boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hardware_inserts_capable boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'maintenance'));

-- Add display_name if not present (alias for full_name or separate)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name text;