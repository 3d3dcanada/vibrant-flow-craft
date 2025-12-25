-- Create enum types for the system
CREATE TYPE public.subscription_tier AS ENUM ('free', 'maker', 'pro');
CREATE TYPE public.point_activity_type AS ENUM (
  'signup_bonus',
  'profile_completion',
  'referral_sent',
  'referral_converted',
  'social_share',
  'recycling_drop',
  'model_upload',
  'purchase',
  'review',
  'streak_bonus',
  'achievement_unlock'
);
CREATE TYPE public.achievement_type AS ENUM (
  'first_print',
  'recycler_bronze',
  'recycler_silver',
  'recycler_gold',
  'referral_champion',
  'social_butterfly',
  'model_creator',
  'loyal_customer',
  'streak_7_day',
  'streak_30_day',
  'big_spender'
);

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Canada',
  profile_completion_percent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Subscriptions table (Canadian pricing)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier subscription_tier DEFAULT 'free' NOT NULL,
  credits_included INTEGER DEFAULT 0,
  admin_fee_discount_percent INTEGER DEFAULT 0,
  bed_rental_discount_percent INTEGER DEFAULT 0,
  price_cad DECIMAL(10,2) DEFAULT 0,
  billing_cycle TEXT DEFAULT 'monthly',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Credits wallet
CREATE TABLE public.credit_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0 NOT NULL,
  lifetime_earned INTEGER DEFAULT 0 NOT NULL,
  lifetime_spent INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Credit transactions
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'purchase', 'spend', 'bonus', 'refund', 'subscription_credit'
  description TEXT,
  reference_id UUID,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Points wallet
CREATE TABLE public.point_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0 NOT NULL,
  lifetime_earned INTEGER DEFAULT 0 NOT NULL,
  lifetime_redeemed INTEGER DEFAULT 0 NOT NULL,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Points transactions/activities
CREATE TABLE public.point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type point_activity_type NOT NULL,
  points INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Referral system
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'signed_up', 'converted'
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  converted_at TIMESTAMP WITH TIME ZONE
);

-- User referral codes
CREATE TABLE public.user_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  uses_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type achievement_type NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- User achievements (junction table)
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- Gift cards
CREATE TABLE public.gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  credits_value INTEGER NOT NULL,
  price_cad DECIMAL(10,2) NOT NULL,
  purchased_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_redeemed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Coupons
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL, -- 'percent', 'fixed', 'credits'
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_cad DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- User coupon usage
CREATE TABLE public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  order_id UUID,
  UNIQUE(user_id, coupon_id)
);

-- Recycling drops
CREATE TABLE public.recycling_drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight_grams INTEGER NOT NULL,
  material_type TEXT NOT NULL,
  location TEXT,
  points_earned INTEGER NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Creator models (user-submitted 3D models)
CREATE TABLE public.creator_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  price_credits INTEGER DEFAULT 0,
  revenue_share_percent INTEGER DEFAULT 80,
  is_approved BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  print_count INTEGER DEFAULT 0,
  total_earnings_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Social shares tracking
CREATE TABLE public.social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL, -- 'twitter', 'facebook', 'instagram', 'linkedin'
  share_type TEXT NOT NULL, -- 'profile', 'print', 'model', 'referral'
  reference_id UUID,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for credit_wallets
CREATE POLICY "Users can view own credit wallet" ON public.credit_wallets FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for point_wallets
CREATE POLICY "Users can view own point wallet" ON public.point_wallets FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for point_transactions
CREATE POLICY "Users can view own point transactions" ON public.point_transactions FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can create referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- RLS Policies for user_referral_codes
CREATE POLICY "Users can view own referral code" ON public.user_referral_codes FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for gift_cards
CREATE POLICY "Users can view own purchased gift cards" ON public.gift_cards FOR SELECT USING (auth.uid() = purchased_by OR auth.uid() = redeemed_by);

-- RLS Policies for coupons (public read for active coupons)
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- RLS Policies for coupon_usage
CREATE POLICY "Users can view own coupon usage" ON public.coupon_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can use coupons" ON public.coupon_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for recycling_drops
CREATE POLICY "Users can view own recycling drops" ON public.recycling_drops FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create recycling drops" ON public.recycling_drops FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for creator_models
CREATE POLICY "Anyone can view approved models" ON public.creator_models FOR SELECT USING (is_approved = true AND is_active = true);
CREATE POLICY "Creators can view own models" ON public.creator_models FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can create models" ON public.creator_models FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own models" ON public.creator_models FOR UPDATE USING (auth.uid() = creator_id);

-- RLS Policies for social_shares
CREATE POLICY "Users can view own shares" ON public.social_shares FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create shares" ON public.social_shares FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to create profile and wallets on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  referral_code TEXT;
BEGIN
  -- Generate unique referral code
  referral_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
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

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update profile completion percentage
CREATE OR REPLACE FUNCTION public.calculate_profile_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  completion INTEGER := 0;
  fields_filled INTEGER := 0;
  total_fields INTEGER := 8;
BEGIN
  -- Count filled fields
  IF NEW.full_name IS NOT NULL AND NEW.full_name != '' THEN fields_filled := fields_filled + 1; END IF;
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN fields_filled := fields_filled + 1; END IF;
  IF NEW.address_line1 IS NOT NULL AND NEW.address_line1 != '' THEN fields_filled := fields_filled + 1; END IF;
  IF NEW.city IS NOT NULL AND NEW.city != '' THEN fields_filled := fields_filled + 1; END IF;
  IF NEW.province IS NOT NULL AND NEW.province != '' THEN fields_filled := fields_filled + 1; END IF;
  IF NEW.postal_code IS NOT NULL AND NEW.postal_code != '' THEN fields_filled := fields_filled + 1; END IF;
  IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url != '' THEN fields_filled := fields_filled + 1; END IF;
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN fields_filled := fields_filled + 1; END IF;
  
  completion := (fields_filled * 100) / total_fields;
  NEW.profile_completion_percent := completion;
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$;

-- Trigger for profile completion calculation
CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.calculate_profile_completion();

-- Insert default achievements
INSERT INTO public.achievements (type, name, description, icon, points_reward) VALUES
  ('first_print', 'First Print', 'Complete your first 3D print order', 'printer', 50),
  ('recycler_bronze', 'Eco Warrior', 'Recycle 100g of plastic', 'recycle', 100),
  ('recycler_silver', 'Green Champion', 'Recycle 500g of plastic', 'recycle', 250),
  ('recycler_gold', 'Planet Protector', 'Recycle 1kg of plastic', 'recycle', 500),
  ('referral_champion', 'Community Builder', 'Refer 5 friends who complete a purchase', 'users', 300),
  ('social_butterfly', 'Social Star', 'Share on 3 different platforms', 'share', 150),
  ('model_creator', 'Creator', 'Upload your first 3D model', 'box', 200),
  ('loyal_customer', 'Loyal Fan', 'Make 10 purchases', 'heart', 400),
  ('streak_7_day', 'Week Warrior', 'Maintain a 7-day activity streak', 'flame', 75),
  ('streak_30_day', 'Dedication Master', 'Maintain a 30-day activity streak', 'flame', 300),
  ('big_spender', 'VIP Customer', 'Spend 10,000 credits', 'crown', 500);