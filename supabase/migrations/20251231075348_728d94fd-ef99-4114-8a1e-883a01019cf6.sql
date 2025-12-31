-- Update print_requests RLS policies for proper intake and admin assignment

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create requests" ON public.print_requests;
DROP POLICY IF EXISTS "Makers can view pending requests" ON public.print_requests;
DROP POLICY IF EXISTS "Makers can view claimed requests" ON public.print_requests;
DROP POLICY IF EXISTS "Makers can claim requests" ON public.print_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON public.print_requests;

-- Add 'admin' to role options (profiles.role can be 'customer', 'maker', or 'admin')
-- Note: role column already exists as text with default 'customer'

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = 'admin'
  )
$$;

-- Create helper function to check if user is maker
CREATE OR REPLACE FUNCTION public.is_maker(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = 'maker'
  )
$$;

-- 1. Anyone (authenticated or not) can create requests
CREATE POLICY "Anyone can create requests" ON public.print_requests
FOR INSERT WITH CHECK (true);

-- 2. Users can view their own requests
CREATE POLICY "Users can view own requests" ON public.print_requests
FOR SELECT USING (auth.uid() = user_id);

-- 3. Makers can view unassigned requests (read-only)
CREATE POLICY "Makers can view unassigned requests" ON public.print_requests
FOR SELECT USING (
  public.is_maker(auth.uid()) AND maker_id IS NULL
);

-- 4. Makers can view requests assigned to them
CREATE POLICY "Makers can view assigned requests" ON public.print_requests
FOR SELECT USING (auth.uid() = maker_id);

-- 5. Admins can view all requests
CREATE POLICY "Admins can view all requests" ON public.print_requests
FOR SELECT USING (public.is_admin(auth.uid()));

-- 6. Admins can update any request (for assignment)
CREATE POLICY "Admins can update any request" ON public.print_requests
FOR UPDATE USING (public.is_admin(auth.uid()));

-- 7. Assigned makers can update their own requests
CREATE POLICY "Makers can update assigned requests" ON public.print_requests
FOR UPDATE USING (auth.uid() = maker_id);

-- 8. Makers can claim unassigned requests (set themselves as maker_id) with conditions
-- This allows claim if they are a maker and the request is unassigned
CREATE POLICY "Makers can claim unassigned requests" ON public.print_requests
FOR UPDATE USING (
  public.is_maker(auth.uid()) 
  AND maker_id IS NULL 
  AND status = 'pending'
);