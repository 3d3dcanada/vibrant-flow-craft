-- Drop policies that depend on is_admin and is_maker
DROP POLICY IF EXISTS "Admins can view all requests" ON public.print_requests;
DROP POLICY IF EXISTS "Admins can update any request" ON public.print_requests;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can do all on promo products" ON public.promo_products;
DROP POLICY IF EXISTS "Admins can do all on store items" ON public.store_items;
DROP POLICY IF EXISTS "Admins can do all on credit packages" ON public.credit_packages;
DROP POLICY IF EXISTS "Admins can view all buyback requests" ON public.buyback_requests;
DROP POLICY IF EXISTS "Admins can update buyback requests" ON public.buyback_requests;
DROP POLICY IF EXISTS "Admins can delete buyback requests" ON public.buyback_requests;
DROP POLICY IF EXISTS "Admins can upload public assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update public assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete public assets" ON storage.objects;
DROP POLICY IF EXISTS "Makers can view unassigned requests" ON public.print_requests;
DROP POLICY IF EXISTS "Makers can claim unassigned requests" ON public.print_requests;

-- Drop old functions
DROP FUNCTION IF EXISTS public.is_admin(uuid);
DROP FUNCTION IF EXISTS public.is_maker(uuid);

-- Create new is_admin function using user_roles
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::app_role)
$$;

-- Create new is_maker function using user_roles
CREATE OR REPLACE FUNCTION public.is_maker(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'maker'::app_role)
$$;

-- Recreate admin policies
CREATE POLICY "Admins can view all requests" ON public.print_requests
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update any request" ON public.print_requests
FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update site settings" ON public.site_settings
FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert site settings" ON public.site_settings
FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can do all on promo products" ON public.promo_products
FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can do all on store items" ON public.store_items
FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can do all on credit packages" ON public.credit_packages
FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all buyback requests" ON public.buyback_requests
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update buyback requests" ON public.buyback_requests
FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete buyback requests" ON public.buyback_requests
FOR DELETE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can upload public assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'public-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update public assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'public-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete public assets" ON storage.objects
FOR DELETE USING (bucket_id = 'public-assets' AND is_admin(auth.uid()));

-- Recreate maker policies
CREATE POLICY "Makers can view unassigned requests" ON public.print_requests
FOR SELECT USING (is_maker(auth.uid()) AND maker_id IS NULL);

CREATE POLICY "Makers can claim unassigned requests" ON public.print_requests
FOR UPDATE USING (is_maker(auth.uid()) AND maker_id IS NULL AND status = 'pending'::print_request_status);

-- Insert admin role for admin@3d3d.ca
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'admin@3d3d.ca'
ON CONFLICT (user_id, role) DO NOTHING;