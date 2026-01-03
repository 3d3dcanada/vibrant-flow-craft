# Current State Audit - 3D3D Canada

**Date:** 2026-01-03
**Auditor:** Claude (Automated Audit)

---

## SQL Queries to Run in Supabase SQL Editor

### 1. Check Auth Users Without Profiles

```sql
SELECT
  au.id,
  au.email,
  au.created_at as auth_created,
  au.raw_user_meta_data ->> 'full_name' as meta_full_name,
  CASE WHEN p.id IS NULL THEN 'MISSING' ELSE 'EXISTS' END as profile_status,
  p.role,
  p.onboarding_completed
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
```

### 2. Check Specifically for admin@3d3d.ca

```sql
SELECT
  au.id,
  au.email,
  au.created_at as auth_created,
  au.raw_user_meta_data,
  p.id as profile_id,
  p.email as profile_email,
  p.full_name,
  p.role,
  p.onboarding_completed,
  s.tier as subscription_tier,
  cw.balance as credit_balance,
  pw.balance as point_balance
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.subscriptions s ON au.id = s.user_id
LEFT JOIN public.credit_wallets cw ON au.id = cw.user_id
LEFT JOIN public.point_wallets pw ON au.id = pw.user_id
WHERE au.email = 'admin@3d3d.ca';
```

### 3. Check if Trigger Exists

```sql
SELECT
  trigger_name,
  event_object_schema,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

### 4. Check if Function Exists and Get Definition

```sql
SELECT
  proname as function_name,
  prosecdef as security_definer,
  provolatile,
  pg_get_functiondef(oid) as definition
FROM pg_proc
WHERE proname = 'handle_new_user';
```

### 5. Check Function Permissions

```sql
SELECT
  proname,
  proowner::regrole as owner,
  proacl as permissions
FROM pg_proc
WHERE proname = 'handle_new_user';
```

### 6. Check if Schema Privilege Exists

```sql
SELECT has_schema_privilege('auth', 'USAGE') as can_access_auth_schema;
```

### 7. Test Manual Profile Creation (DRY RUN)

```sql
-- First, find the user ID for admin@3d3d.ca
SELECT id, email FROM auth.users WHERE email = 'admin@3d3d.ca';

-- Then verify what SHOULD be created (don't actually run)
-- This shows what the trigger function would do:
/*
INSERT INTO public.profiles (id, email, full_name, role, onboarding_completed)
VALUES ('<user_id>', 'admin@3d3d.ca', 'Admin Name', 'admin', true);

INSERT INTO public.subscriptions (user_id, tier, credits_included, price_cad)
VALUES ('<user_id>', 'free', 0, 0);

INSERT INTO public.credit_wallets (user_id, balance)
VALUES ('<user_id>', 0);

INSERT INTO public.point_wallets (user_id, balance, lifetime_earned, last_activity_date)
VALUES ('<user_id>', 100, 100, CURRENT_DATE);

INSERT INTO public.user_referral_codes (user_id, code)
VALUES ('<user_id>', UPPER(SUBSTRING(MD5('<user_id>' || NOW()::TEXT) FROM 1 FOR 8)));
*/
```

---

## Expected State vs Likely Actual State

### For admin@3d3d.ca

| Resource | Expected | Likely Actual |
|----------|----------|---------------|
| auth.users row | EXISTS | EXISTS |
| profiles row | EXISTS with role='admin' | **MISSING** |
| subscriptions row | EXISTS (free tier) | **MISSING** |
| credit_wallets row | EXISTS (0 balance) | **MISSING** |
| point_wallets row | EXISTS (100 points) | **MISSING** |
| user_referral_codes row | EXISTS | **MISSING** |

---

## Possible Trigger Failure Scenarios

### Scenario 1: Migration Not Applied Before Signup

If the user signed up before the migration was deployed to production:
- No trigger existed at signup time
- No profile was created
- User is now stuck

**Verification:**
```sql
-- Compare user creation time with first migration
SELECT
  au.created_at as user_created,
  (SELECT version FROM supabase_migrations.schema_migrations ORDER BY version LIMIT 1) as first_migration
FROM auth.users au
WHERE au.email = 'admin@3d3d.ca';
```

### Scenario 2: Trigger Function Error

The function could fail silently if:
- RLS policies block the INSERT (shouldn't happen with SECURITY DEFINER)
- Unique constraint violation (shouldn't happen for new user)
- Foreign key violation (shouldn't happen - references auth.users)
- Column doesn't exist (possible if migrations out of sync)

**Check for errors in function execution:**
```sql
-- There's no built-in way to see trigger errors after the fact
-- But we can test the function manually:
DO $$
BEGIN
  PERFORM public.handle_new_user();
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error: %', SQLERRM;
END $$;
```

### Scenario 3: Supabase Auth Webhook Issue

In some Supabase configurations, the trigger may not fire due to:
- Database connection pooling issues
- Transaction isolation issues
- Webhook vs direct trigger execution differences

---

## Immediate Diagnostic Commands

### Run These in Order:

```sql
-- 1. Confirm user exists
SELECT id, email, created_at FROM auth.users WHERE email = 'admin@3d3d.ca';

-- 2. Confirm profile is missing
SELECT * FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@3d3d.ca');

-- 3. Confirm trigger exists
SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- 4. Confirm function exists
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- 5. If all above exist, the trigger failed silently at signup time
```

---

## RLS Policy Check for Profiles

```sql
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';
```

**Expected policies:**
- `Users can view own profile` (SELECT)
- `Users can update own profile` (UPDATE)
- `Users can insert own profile` (INSERT)

**Note:** The INSERT policy requires `auth.uid() = id`, but the trigger function uses `SECURITY DEFINER` which should bypass this check entirely.

---

## Checking for Orphaned Related Data

```sql
-- Check if any wallets exist without profiles (shouldn't happen)
SELECT 'credit_wallets' as table_name, cw.user_id
FROM public.credit_wallets cw
LEFT JOIN public.profiles p ON cw.user_id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 'point_wallets', pw.user_id
FROM public.point_wallets pw
LEFT JOIN public.profiles p ON pw.user_id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 'subscriptions', s.user_id
FROM public.subscriptions s
LEFT JOIN public.profiles p ON s.user_id = p.id
WHERE p.id IS NULL;
```

---

## Testing the Trigger Function Manually

```sql
-- Create a test to verify the function works
-- This simulates what should happen on signup

-- First, create a test in a transaction you'll roll back
BEGIN;

-- Manually call what the trigger would do
-- (Replace with actual user ID from auth.users)
DO $$
DECLARE
  test_user_id UUID := 'YOUR_USER_ID_HERE';
  test_email TEXT := 'admin@3d3d.ca';
  test_full_name TEXT := 'Admin User';
  referral_code TEXT;
BEGIN
  referral_code := UPPER(SUBSTRING(MD5(test_user_id::TEXT || NOW()::TEXT) FROM 1 FOR 8));

  INSERT INTO public.profiles (id, email, full_name)
  VALUES (test_user_id, test_email, test_full_name);

  INSERT INTO public.subscriptions (user_id, tier, credits_included, price_cad)
  VALUES (test_user_id, 'free', 0, 0);

  INSERT INTO public.credit_wallets (user_id, balance)
  VALUES (test_user_id, 0);

  INSERT INTO public.point_wallets (user_id, balance, lifetime_earned, last_activity_date)
  VALUES (test_user_id, 100, 100, CURRENT_DATE);

  INSERT INTO public.point_transactions (user_id, activity_type, points, description, balance_after)
  VALUES (test_user_id, 'signup_bonus', 100, 'Welcome bonus for joining 3D3D Canada!', 100);

  INSERT INTO public.user_referral_codes (user_id, code)
  VALUES (test_user_id, referral_code);

  RAISE NOTICE 'All inserts succeeded!';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error: % %', SQLSTATE, SQLERRM;
END $$;

ROLLBACK; -- Don't actually commit
```
