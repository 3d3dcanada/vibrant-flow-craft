-- Site Settings table (single row config)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  homepage_banner_enabled boolean DEFAULT false,
  homepage_banner_title text DEFAULT '',
  homepage_banner_subtitle text DEFAULT '',
  homepage_banner_cta_text text DEFAULT '',
  homepage_banner_cta_url text DEFAULT '',
  promo_pool_cap_cad numeric DEFAULT 500,
  social_reward_credits integer DEFAULT 25,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default row
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read, admin write
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Promo Products table
CREATE TABLE IF NOT EXISTS public.promo_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  active boolean DEFAULT true,
  month_tag text DEFAULT to_char(now(), 'YYYY-MM'),
  category text NOT NULL DEFAULT 'Office',
  name text NOT NULL,
  description text,
  image_url text,
  default_material text DEFAULT 'PLA_STANDARD',
  grams_per_unit integer DEFAULT 10,
  minutes_per_unit integer DEFAULT 15,
  moqs jsonb DEFAULT '{"25": null, "50": null, "100": null}'::jsonb,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.promo_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active promo products" ON public.promo_products
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can do all on promo products" ON public.promo_products
  FOR ALL USING (is_admin(auth.uid()));

-- Store Items table
CREATE TABLE IF NOT EXISTS public.store_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  active boolean DEFAULT true,
  name text NOT NULL,
  description text,
  image_url text,
  type text NOT NULL DEFAULT 'design',
  base_price_cad numeric,
  credits_price integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active store items" ON public.store_items
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can do all on store items" ON public.store_items
  FOR ALL USING (is_admin(auth.uid()));

-- Credit Packages table
CREATE TABLE IF NOT EXISTS public.credit_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  active boolean DEFAULT true,
  name text NOT NULL,
  price_cad numeric NOT NULL,
  credits_amount integer NOT NULL,
  bonus_credits integer DEFAULT 0,
  tagline text,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active credit packages" ON public.credit_packages
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can do all on credit packages" ON public.credit_packages
  FOR ALL USING (is_admin(auth.uid()));

-- Insert default credit packages (matching current hardcoded values)
INSERT INTO public.credit_packages (name, price_cad, credits_amount, bonus_credits, tagline, active) VALUES
  ('Starter', 5, 50, 0, NULL, true),
  ('Basic', 12, 120, 0, NULL, true),
  ('Popular', 22, 220, 20, 'BEST VALUE', true),
  ('Pro', 50, 500, 50, NULL, true),
  ('Business', 95, 950, 100, NULL, true),
  ('Enterprise', 175, 1750, 250, NULL, true);

-- Add maker verification fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS maker_verified boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS maker_verification_notes text;

-- Create storage bucket for public assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public-assets bucket
CREATE POLICY "Anyone can view public assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'public-assets');

CREATE POLICY "Admins can upload public assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'public-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update public assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'public-assets' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete public assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'public-assets' AND is_admin(auth.uid()));

-- Trigger for updated_at on new tables
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promo_products_updated_at
  BEFORE UPDATE ON public.promo_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_items_updated_at
  BEFORE UPDATE ON public.store_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_credit_packages_updated_at
  BEFORE UPDATE ON public.credit_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();