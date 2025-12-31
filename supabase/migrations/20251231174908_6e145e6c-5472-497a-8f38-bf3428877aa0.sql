-- Create enum for buyback item types
CREATE TYPE public.buyback_item_type AS ENUM ('printer', 'filament', 'electronics', 'donation');

-- Create enum for buyback request status
CREATE TYPE public.buyback_status AS ENUM ('new', 'in_review', 'quoted', 'accepted', 'declined', 'closed');

-- Create buyback_requests table
CREATE TABLE public.buyback_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  item_type public.buyback_item_type NOT NULL,
  brand_model TEXT,
  condition TEXT,
  notes TEXT,
  photo_url TEXT,
  city TEXT,
  province TEXT,
  contact_email TEXT NOT NULL,
  status public.buyback_status NOT NULL DEFAULT 'new',
  quoted_amount_cad NUMERIC,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.buyback_requests ENABLE ROW LEVEL SECURITY;

-- Users can insert their own requests
CREATE POLICY "Anyone can insert buyback requests"
ON public.buyback_requests
FOR INSERT
WITH CHECK (true);

-- Users can view their own requests (by user_id or guest_email match)
CREATE POLICY "Users can view own buyback requests"
ON public.buyback_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all buyback requests
CREATE POLICY "Admins can view all buyback requests"
ON public.buyback_requests
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Admins can update any buyback request
CREATE POLICY "Admins can update buyback requests"
ON public.buyback_requests
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Admins can delete buyback requests
CREATE POLICY "Admins can delete buyback requests"
ON public.buyback_requests
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER update_buyback_requests_updated_at
BEFORE UPDATE ON public.buyback_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();