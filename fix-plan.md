# Fix Plan - 3D3D Canada Auth Issues

**Date:** 2026-01-03
**Priority:** URGENT - Founder blocked from admin access

---

## IMMEDIATE FIX (5 minutes)

### Get admin@3d3d.ca Working RIGHT NOW

Run this SQL in Supabase SQL Editor:

```sql
-- Step 1: Get the user ID
SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'admin@3d3d.ca';

-- Step 2: Create profile (replace YOUR_USER_ID with actual UUID from step 1)
INSERT INTO public.profiles (id, email, full_name, role, onboarding_completed)
VALUES (
  'YOUR_USER_ID',  -- Replace with actual UUID
  'admin@3d3d.ca',
  COALESCE((SELECT raw_user_meta_data ->> 'full_name' FROM auth.users WHERE email = 'admin@3d3d.ca'), 'Admin'),
  'admin',  -- Set as admin role
  true      -- Skip onboarding
);

-- Step 3: Create subscription
INSERT INTO public.subscriptions (user_id, tier, credits_included, price_cad)
VALUES ('YOUR_USER_ID', 'free', 0, 0);

-- Step 4: Create credit wallet
INSERT INTO public.credit_wallets (user_id, balance)
VALUES ('YOUR_USER_ID', 0);

-- Step 5: Create point wallet with signup bonus
INSERT INTO public.point_wallets (user_id, balance, lifetime_earned, last_activity_date)
VALUES ('YOUR_USER_ID', 100, 100, CURRENT_DATE);

-- Step 6: Create point transaction
INSERT INTO public.point_transactions (user_id, activity_type, points, description, balance_after)
VALUES ('YOUR_USER_ID', 'signup_bonus', 100, 'Welcome bonus for joining 3D3D Canada!', 100);

-- Step 7: Create referral code
INSERT INTO public.user_referral_codes (user_id, code)
VALUES ('YOUR_USER_ID', UPPER(SUBSTRING(MD5('YOUR_USER_ID' || NOW()::TEXT) FROM 1 FOR 8)));
```

**One-liner version (replace UUID):**

```sql
DO $$
DECLARE
  v_user_id UUID := (SELECT id FROM auth.users WHERE email = 'admin@3d3d.ca');
  v_email TEXT := 'admin@3d3d.ca';
  v_full_name TEXT := (SELECT COALESCE(raw_user_meta_data ->> 'full_name', 'Admin') FROM auth.users WHERE email = 'admin@3d3d.ca');
  v_referral_code TEXT := UPPER(SUBSTRING(MD5(v_user_id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, onboarding_completed)
  VALUES (v_user_id, v_email, v_full_name, 'admin', true);

  INSERT INTO public.subscriptions (user_id, tier, credits_included, price_cad)
  VALUES (v_user_id, 'free', 0, 0);

  INSERT INTO public.credit_wallets (user_id, balance)
  VALUES (v_user_id, 0);

  INSERT INTO public.point_wallets (user_id, balance, lifetime_earned, last_activity_date)
  VALUES (v_user_id, 100, 100, CURRENT_DATE);

  INSERT INTO public.point_transactions (user_id, activity_type, points, description, balance_after)
  VALUES (v_user_id, 'signup_bonus', 100, 'Welcome bonus for joining 3D3D Canada!', 100);

  INSERT INTO public.user_referral_codes (user_id, code)
  VALUES (v_user_id, v_referral_code);

  RAISE NOTICE 'Admin profile created successfully!';
END $$;
```

After running this, admin@3d3d.ca should be able to access `/dashboard/admin`.

---

## SHORT-TERM FIXES (1-2 hours)

### Fix 1: Add Client-Side Profile Creation Fallback

**File:** `src/hooks/useUserData.ts`

```typescript
export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Try to fetch existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      // If profile exists, return it
      if (data) return data;

      // FALLBACK: Create profile if missing
      console.warn('Profile missing for user, creating fallback...');

      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Create profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          role: 'customer',
          onboarding_completed: false
        })
        .select()
        .single();

      if (insertError) {
        console.error('Failed to create fallback profile:', insertError);
        throw insertError;
      }

      // Create associated wallets (best effort)
      await Promise.allSettled([
        supabase.from('subscriptions').insert({ user_id: user.id, tier: 'free', credits_included: 0, price_cad: 0 }),
        supabase.from('credit_wallets').insert({ user_id: user.id, balance: 0 }),
        supabase.from('point_wallets').insert({ user_id: user.id, balance: 100, lifetime_earned: 100, last_activity_date: new Date().toISOString().split('T')[0] }),
        supabase.from('user_referral_codes').insert({ user_id: user.id, code: referralCode })
      ]);

      return newProfile;
    },
    enabled: !!user
  });
};
```

### Fix 2: Change Onboarding to Use UPSERT

**File:** `src/pages/Onboarding.tsx`

Change line 110 from:
```typescript
const { error } = await supabase
  .from('profiles')
  .update(updateData)
  .eq('id', user.id);
```

To:
```typescript
const { error } = await supabase
  .from('profiles')
  .upsert({
    id: user.id,
    ...updateData
  });
```

### Fix 3: Handle Null Profile in Dashboard

**File:** `src/pages/Dashboard.tsx`

Add after line 46:

```typescript
// Handle case where profile is null but user exists
if (!profile && !profileLoading && !isError) {
  // Profile doesn't exist - this shouldn't happen but fallback to customer
  console.warn('Profile missing for authenticated user, redirecting to onboarding...');
  navigate('/onboarding');
  return;
}
```

### Fix 4: Handle Null Profile in Auth.tsx

**File:** `src/pages/Auth.tsx`

Update the profile fetch logic (lines 50-74):

```typescript
useEffect(() => {
  if (user) {
    supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching profile:', error);
          navigate('/dashboard');
          return;
        }

        // NEW: Handle missing profile
        if (!data) {
          console.warn('Profile missing, redirecting to onboarding...');
          navigate('/onboarding');
          return;
        }

        if (data.onboarding_completed === false) {
          navigate('/onboarding');
          return;
        }

        navigate('/dashboard');
      });
  }
}, [user, navigate]);
```

---

## MEDIUM-TERM FIXES (1 day)

### Fix 5: Improve Trigger Function with Error Handling

Create a new migration:

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_improve_handle_new_user.sql

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

  BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, email, full_name, role, onboarding_completed)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data ->> 'full_name',
      'customer',
      false
    );

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

  EXCEPTION WHEN OTHERS THEN
    -- Log the error for debugging
    RAISE WARNING 'handle_new_user failed for user %: % %', NEW.id, SQLSTATE, SQLERRM;
    -- Re-raise to ensure we know about failures
    RAISE;
  END;

  RETURN NEW;
END;
$$;
```

### Fix 6: Create Admin Bootstrap Function

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_admin_bootstrap.sql

CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user ID
  SELECT id INTO v_user_id FROM auth.users WHERE email = user_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: %', user_email;
  END IF;

  -- Update profile to admin
  UPDATE public.profiles
  SET role = 'admin', onboarding_completed = true
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found for user: %', user_email;
  END IF;
END;
$$;

-- Only allow service role to call this function
REVOKE EXECUTE ON FUNCTION public.promote_to_admin FROM PUBLIC;
```

---

## LONG-TERM IMPROVEMENTS

### 1. Create Orphan Profile Detection Job

Create a scheduled function to detect and fix orphaned auth users:

```sql
-- Run daily via pg_cron or Supabase scheduled functions
CREATE OR REPLACE FUNCTION public.fix_orphan_auth_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  orphan RECORD;
  referral_code TEXT;
BEGIN
  FOR orphan IN
    SELECT au.id, au.email, au.raw_user_meta_data ->> 'full_name' as full_name
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    referral_code := UPPER(SUBSTRING(MD5(orphan.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));

    BEGIN
      INSERT INTO public.profiles (id, email, full_name, role, onboarding_completed)
      VALUES (orphan.id, orphan.email, orphan.full_name, 'customer', false);

      INSERT INTO public.subscriptions (user_id, tier, credits_included, price_cad)
      VALUES (orphan.id, 'free', 0, 0);

      INSERT INTO public.credit_wallets (user_id, balance)
      VALUES (orphan.id, 0);

      INSERT INTO public.point_wallets (user_id, balance, lifetime_earned, last_activity_date)
      VALUES (orphan.id, 100, 100, CURRENT_DATE);

      INSERT INTO public.user_referral_codes (user_id, code)
      VALUES (orphan.id, referral_code);

      RAISE NOTICE 'Fixed orphan user: %', orphan.email;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to fix orphan %: %', orphan.email, SQLERRM;
    END;
  END LOOP;
END;
$$;
```

### 2. Add Health Check Endpoint

Create an edge function to verify auth/profile consistency:

```typescript
// supabase/functions/health-check/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Count orphan auth users
  const { data, error } = await supabase.rpc('count_orphan_users')

  return new Response(JSON.stringify({
    status: data === 0 ? 'healthy' : 'unhealthy',
    orphan_count: data,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 3. Proper Migration Strategy

1. **Always test migrations locally first** using `supabase db reset`
2. **Include rollback scripts** for each migration
3. **Add migration verification** that checks for orphan users after deploy
4. **Use feature flags** for auth changes to allow gradual rollout

---

## Cleanup Tasks

### Remove Orphaned Tables

No orphaned tables were found - the schema is clean.

### Verify All Migrations Applied

```sql
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version;
```

Ensure all 8 migrations are present.

---

## Implementation Priority

| Priority | Task | Time | Impact |
|----------|------|------|--------|
| 1 | Run immediate SQL fix for admin | 5 min | Unblocks founder |
| 2 | Fix useProfile fallback | 30 min | Prevents future stuck users |
| 3 | Fix Onboarding upsert | 15 min | Allows profile creation |
| 4 | Handle null in Dashboard | 15 min | Better UX for edge cases |
| 5 | Handle null in Auth.tsx | 15 min | Redirect to onboarding |
| 6 | Improve trigger function | 30 min | Better error visibility |
| 7 | Admin bootstrap function | 30 min | Easier admin management |
| 8 | Orphan detection job | 1 hr | Automatic healing |

---

## Verification After Fixes

After implementing fixes, verify:

1. **admin@3d3d.ca can log in** and sees admin dashboard
2. **New signups create profiles** correctly
3. **Trigger errors are logged** if they occur
4. **Orphan detection** catches any remaining issues
5. **Onboarding works** for users with missing profiles
