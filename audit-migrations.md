# Migration History Audit - 3D3D Canada

**Date:** 2026-01-03
**Auditor:** Claude (Automated Audit)

---

## Migration Files (Chronological Order)

| # | Filename | Date | Purpose |
|---|----------|------|---------|
| 1 | `20251225100910_4f74f2bb-48cc-4b3b-b3d1-0f0cac9e5169.sql` | Dec 25, 2025 | **Initial schema** - profiles, wallets, trigger |
| 2 | `20251231061544_a4eacd25-8f45-400c-b755-74501e550d01.sql` | Dec 31, 2025 | Add role/maker fields to profiles |
| 3 | `20251231072528_66b2fcd6-5e42-49fe-afb2-0e50bf3ca0ae.sql` | Dec 31, 2025 | Maker tables (printers, jobs, requests) |
| 4 | `20251231075348_728d94fd-ef99-4114-8a1e-883a01019cf6.sql` | Dec 31, 2025 | Update RLS policies, add is_admin/is_maker |
| 5 | `20251231080852_a36632b9-6a19-4d70-a61d-55b93d86da48.sql` | Dec 31, 2025 | Site settings, promo products, credit packages |
| 6 | `20251231105209_b6b85509-4a15-4bd7-bb9a-2357775d5980.sql` | Dec 31, 2025 | Remove direct INSERT policies (security) |
| 7 | `20251231133829_77faa6f4-ed05-4e30-a39e-ab55c7e9538a.sql` | Dec 31, 2025 | Gift card redemption function |
| 8 | `20251231174908_6e145e6c-5472-497a-8f38-bf3428877aa0.sql` | Dec 31, 2025 | Buyback requests table |

---

## Migration 1: Initial Schema (Dec 25, 2025)

**File:** `20251225100910_4f74f2bb-48cc-4b3b-b3d1-0f0cac9e5169.sql`

### Tables Created:
- `profiles` - User profiles
- `subscriptions` - Subscription tiers
- `credit_wallets` - Credit balances
- `credit_transactions` - Credit history
- `point_wallets` - Reward points
- `point_transactions` - Points history
- `referrals` - Referral tracking
- `user_referral_codes` - Unique referral codes
- `achievements` - Achievement definitions
- `user_achievements` - Unlocked achievements
- `gift_cards` - Gift card inventory
- `coupons` - Coupon codes
- `coupon_usage` - Coupon usage
- `recycling_drops` - Recycling records
- `creator_models` - User 3D models
- `social_shares` - Social sharing

### Enums Created:
- `subscription_tier`: 'free', 'maker', 'pro'
- `point_activity_type`: 'signup_bonus', 'profile_completion', etc.
- `achievement_type`: 'first_print', 'recycler_bronze', etc.

### Critical Function: `handle_new_user()`

```sql
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
```

### Critical Trigger:

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### RLS Policies for Profiles:

```sql
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## Migration 2: Role & Maker Fields (Dec 31, 2025)

**File:** `20251231061544_a4eacd25-8f45-400c-b755-74501e550d01.sql`

### New Columns Added to Profiles:

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `role` | text | 'customer' | User role (customer/maker/admin) |
| `onboarding_completed` | boolean | false | Onboarding status |
| `dry_box_required_ack` | boolean | false | Maker dry box acknowledgement |
| `printer_models` | text | null | Maker printer list |
| `nozzle_sizes` | text | null | Maker nozzle sizes |
| `materials_supported` | text | null | Maker materials |
| `post_processing_capable` | boolean | false | Maker capability |
| `hardware_inserts_capable` | boolean | false | Maker capability |
| `availability_status` | text | 'available' | Maker status |
| `display_name` | text | null | Display name |

**Note:** The trigger function was NOT updated to set `role` or `onboarding_completed` defaults. New users get database defaults.

---

## Migration 3: Maker Tables (Dec 31, 2025)

**File:** `20251231072528_66b2fcd6-5e42-49fe-afb2-0e50bf3ca0ae.sql`

### New Enums:
- `print_request_status`
- `print_job_status`
- `printer_status`
- `printer_connection_type`
- `payout_status`
- `filament_dry_status`

### New Tables:
- `print_requests` - Customer print requests
- `print_jobs` - Maker print jobs
- `maker_printers` - Maker printer inventory
- `maker_filament` - Maker filament inventory
- `payout_requests` - Maker payout requests

---

## Migration 4: RLS Updates & Admin/Maker Functions (Dec 31, 2025)

**File:** `20251231075348_728d94fd-ef99-4114-8a1e-883a01019cf6.sql`

### Helper Functions:

```sql
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_maker(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'maker'
  )
$$;
```

**Critical Observation:** These functions check the `profiles` table for role. If no profile exists, both return `false`.

---

## Migration 5: Site Settings & Products (Dec 31, 2025)

**File:** `20251231080852_a36632b9-6a19-4d70-a61d-55b93d86da48.sql`

### New Tables:
- `site_settings` - Global config (single row)
- `promo_products` - Promotional products
- `store_items` - Store inventory
- `credit_packages` - Credit package offerings

### New Profile Columns:
- `maker_verified` (boolean, default false)
- `maker_verification_notes` (text)

---

## Migration 6: Security Hardening (Dec 31, 2025)

**File:** `20251231105209_b6b85509-4a15-4bd7-bb9a-2357775d5980.sql`

Removes direct INSERT policies for:
- `recycling_drops`
- `social_shares`

These now require edge functions with service role.

---

## Migration 7: Gift Card Redemption (Dec 31, 2025)

**File:** `20251231133829_77faa6f4-ed05-4e30-a39e-ab55c7e9538a.sql`

Creates `redeem_gift_card(p_code TEXT)` RPC function.

---

## Migration 8: Buyback Requests (Dec 31, 2025)

**File:** `20251231174908_6e145e6c-5472-497a-8f38-bf3428877aa0.sql`

### New Enums:
- `buyback_item_type`
- `buyback_status`

### New Table:
- `buyback_requests` - Equipment buyback requests

---

## Critical Migration Issues

### 1. Trigger May Not Have Been Applied

If admin@3d3d.ca signed up BEFORE the first migration was applied to production, the trigger would not have existed yet.

**Verification Query:**
```sql
SELECT
  au.email,
  au.created_at as auth_created,
  (SELECT created_at FROM supabase_migrations.schema_migrations
   ORDER BY version LIMIT 1) as first_migration
FROM auth.users au
WHERE au.email = 'admin@3d3d.ca';
```

### 2. Trigger Function Not Updated

When role fields were added in migration 2, the `handle_new_user()` function was NOT updated. New users rely on database column defaults.

### 3. No Rollback for Failed Trigger

The trigger function has no error handling. If any INSERT fails, the entire function fails, and no profile/wallets are created.

---

## Files Touching Profiles Table

```bash
grep -l "profiles" supabase/migrations/*.sql
```

Results:
- `20251225100910_...sql` - CREATE TABLE, trigger, RLS
- `20251231061544_...sql` - ALTER TABLE add columns
- `20251231080852_...sql` - ALTER TABLE add maker_verified

---

## Files Creating Triggers/Functions

```bash
grep -l "CREATE TRIGGER\|CREATE OR REPLACE FUNCTION" supabase/migrations/*.sql
```

Results:
- `20251225100910_...sql` - handle_new_user, calculate_profile_completion
- `20251231072528_...sql` - update_updated_at_column
- `20251231075348_...sql` - is_admin, is_maker
- `20251231080852_...sql` - Multiple update triggers
- `20251231133829_...sql` - redeem_gift_card
