-- Drop the existing constraint and add a new one that includes 'admin'
ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role = ANY (ARRAY['customer'::text, 'maker'::text, 'admin'::text]));

-- Now update the admin user's role
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@3d3d.ca';