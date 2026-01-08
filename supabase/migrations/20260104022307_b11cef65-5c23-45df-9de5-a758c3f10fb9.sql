-- Remove role column from profiles table (roles now stored in user_roles)
-- First drop any policies that depend on the role column
DROP POLICY IF EXISTS "Users can update own profile (no role)" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Drop the constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Drop the role column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Update handle_new_user to not include role (it's now in user_roles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referral_code TEXT;
BEGIN
  -- Generate unique referral code
  referral_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  
  -- Create profile (no role - that goes in user_roles)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Create default customer role in user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  -- Create subscription (free tier)
  INSERT INTO public.subscriptions (user_id, tier, credits_included, price_cad)
  VALUES (NEW.id, 'free', 0, 0);
  
  -- Create credit wallet
  INSERT INTO public.credit_wallets (user_id, balance)
  VALUES (NEW.id, 0);
  
  -- Create point wallet with signup bonus
  INSERT INTO public.point_wallets (user_id, balance, lifetime_earned, last_activity_date)
  VALUES (NEW.id, 100, 100, CURRENT_DATE);
  
  -- Record signup bonus transaction
  INSERT INTO public.point_transactions (user_id, activity_type, points, description, balance_after)
  VALUES (NEW.id, 'signup_bonus', 100, 'Welcome bonus for joining 3D3D Canada!', 100);
  
  -- Create referral code
  INSERT INTO public.user_referral_codes (user_id, code)
  VALUES (NEW.id, referral_code);
  
  RETURN NEW;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();