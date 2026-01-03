# Database Schema Audit - 3D3D Canada

**Date:** 2026-01-03
**Auditor:** Claude (Automated Audit)
**Stack:** Supabase (PostgreSQL 14.1)

---

## SQL Queries to Run in Supabase SQL Editor

### 1. List ALL Tables in Public Schema

```sql
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 2. Show Structure of Auth-Critical Tables

```sql
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'subscriptions', 'credit_wallets', 'point_wallets', 'user_referral_codes')
ORDER BY table_name, ordinal_position;
```

### 3. List ALL Triggers

```sql
SELECT
  trigger_name,
  event_object_schema,
  event_object_table,
  action_statement,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public' OR event_object_schema = 'auth'
ORDER BY event_object_table, trigger_name;
```

### 4. List ALL Functions

```sql
SELECT
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

### 5. Check RLS Policies on Profiles Table

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';
```

---

## Expected Tables (27 total from TypeScript types)

| Table Name | Purpose | Auth-Critical |
|------------|---------|---------------|
| `profiles` | User profiles, role, onboarding status | **YES** |
| `subscriptions` | User subscription tiers (free/maker/pro) | **YES** |
| `credit_wallets` | User credit balances | **YES** |
| `point_wallets` | User reward points | **YES** |
| `user_referral_codes` | Unique referral codes per user | **YES** |
| `achievements` | Achievement definitions | No |
| `user_achievements` | Junction table for unlocked achievements | No |
| `referrals` | Referral tracking | No |
| `gift_cards` | Gift card inventory | No |
| `coupons` | Coupon codes | No |
| `coupon_usage` | Coupon usage tracking | No |
| `recycling_drops` | Recycling records | No |
| `creator_models` | User-submitted 3D models | No |
| `social_shares` | Social sharing tracking | No |
| `credit_transactions` | Credit transaction history | No |
| `point_transactions` | Point transaction history | No |
| `print_requests` | Customer print requests | No |
| `print_jobs` | Maker print jobs | No |
| `maker_printers` | Maker printer inventory | No |
| `maker_filament` | Maker filament inventory | No |
| `payout_requests` | Maker payout requests | No |
| `site_settings` | Global site configuration | No |
| `promo_products` | Promotional products | No |
| `store_items` | Store inventory | No |
| `credit_packages` | Credit package offerings | No |
| `buyback_requests` | Equipment buyback requests | No |

---

## Critical Profiles Table Schema

From migration `20251225100910`:

```sql
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
```

Additional columns from migration `20251231061544`:

```sql
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS dry_box_required_ack boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS printer_models text,
ADD COLUMN IF NOT EXISTS nozzle_sizes text,
ADD COLUMN IF NOT EXISTS materials_supported text,
ADD COLUMN IF NOT EXISTS post_processing_capable boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hardware_inserts_capable boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS availability_status text DEFAULT 'available',
ADD COLUMN IF NOT EXISTS display_name text;
```

Additional columns from migration `20251231080852`:

```sql
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS maker_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS maker_verification_notes text;
```

---

## Critical Trigger: on_auth_user_created

**Defined in:** `20251225100910_4f74f2bb-48cc-4b3b-b3d1-0f0cac9e5169.sql`

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Function:** `handle_new_user()`

This function should:
1. Create a profile row
2. Create a subscription row (free tier)
3. Create a credit wallet row
4. Create a point wallet row (with 100 bonus points)
5. Create a point transaction for signup bonus
6. Create a referral code

---

## RLS Policies on Profiles

Expected policies from migration:

| Policy Name | Operation | Condition |
|-------------|-----------|-----------|
| `Users can view own profile` | SELECT | `auth.uid() = id` |
| `Users can update own profile` | UPDATE | `auth.uid() = id` |
| `Users can insert own profile` | INSERT | `auth.uid() = id` |

**CRITICAL ISSUE:** The INSERT policy requires `auth.uid() = id`, but the trigger function uses `SECURITY DEFINER` which should bypass RLS. If RLS is not being bypassed, profile creation would fail.

---

## Verification Queries

### Check if profiles exist for auth users

```sql
SELECT
  au.id,
  au.email,
  au.created_at as auth_created,
  p.id as profile_id,
  p.role,
  p.onboarding_completed
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
```

### Check if trigger exists

```sql
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

### Check function definition

```sql
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'handle_new_user';
```
