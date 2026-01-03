# Auth Flow Audit - 3D3D Canada

**Date:** 2026-01-03
**Auditor:** Claude (Automated Audit)

---

## Overview

The authentication system uses Supabase Auth with a custom trigger to create user profiles and associated data on signup.

---

## Auth Flow Files

### 1. AuthContext.tsx (`src/contexts/AuthContext.tsx`)

**Purpose:** Manages authentication state and provides auth methods.

**Key Functions:**

| Function | Description |
|----------|-------------|
| `signUp(email, password, fullName)` | Creates user account with metadata |
| `signIn(email, password)` | Signs in with password |
| `signOut()` | Signs out user |
| `resetPassword(email)` | Sends password reset email |
| `updatePassword(newPassword)` | Updates user password |

**Signup Implementation:**
```typescript
const signUp = async (email: string, password: string, fullName: string) => {
  const redirectUrl = `${window.location.origin}/`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName  // <-- Stored in raw_user_meta_data
      }
    }
  });
  return { error };
};
```

**Critical Observation:** The `full_name` is passed via `options.data` which stores it in `raw_user_meta_data`. The trigger function reads this with `NEW.raw_user_meta_data ->> 'full_name'`.

---

### 2. Auth.tsx (`src/pages/Auth.tsx`)

**Purpose:** Login/Signup page with form handling and post-auth redirect.

**Post-Login Redirect Logic (lines 50-74):**
```typescript
useEffect(() => {
  if (user) {
    // Fetch profile to check role and onboarding status
    supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .maybeSingle()  // <-- Returns null if no row exists
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching profile:', error);
          navigate('/dashboard');
          return;
        }

        if (data?.onboarding_completed === false) {
          navigate('/onboarding');
          return;
        }

        // Always redirect to /dashboard - it will handle role-based routing
        navigate('/dashboard');
      });
  }
}, [user, navigate]);
```

**Critical Issue:** Uses `maybeSingle()` which returns `null` if no profile exists. If the trigger failed, `data` would be `null`, and the user would still navigate to `/dashboard`.

---

### 3. Dashboard.tsx (`src/pages/Dashboard.tsx`)

**Purpose:** Pure redirect controller - fetches profile and redirects by role.

**Key Logic:**
```typescript
const { data: profile, isLoading: profileLoading, isError, refetch } = useProfile();

useEffect(() => {
  if (authLoading) return;
  if (!user) { navigate('/auth'); return; }
  if (profileLoading) return;

  if (profile) {
    const role = profile.role || 'customer';

    if (role === 'admin') {
      navigate('/dashboard/admin', { replace: true });
    } else if (role === 'maker') {
      navigate('/dashboard/maker', { replace: true });
    } else {
      navigate('/dashboard/customer', { replace: true });
    }
  }
}, [user, authLoading, profileLoading, profile, navigate]);
```

**Critical Issue:** When `profile` is `null` (trigger failed), the `if (profile)` block never executes, and the user is stuck on the loading screen indefinitely.

---

### 4. useUserData.ts (`src/hooks/useUserData.ts`)

**Purpose:** React Query hook for fetching user profile.

**useProfile Implementation:**
```typescript
export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();  // <-- Returns null if no row
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
};
```

**Issue:** Returns `null` for missing profiles, which causes Dashboard to show loading indefinitely.

---

### 5. Onboarding.tsx (`src/pages/Onboarding.tsx`)

**Purpose:** Role selection and profile completion.

**Profile Update Logic:**
```typescript
const handleComplete = async () => {
  const updateData = {
    role,
    display_name: displayName.trim(),
    onboarding_completed: true,
    // ... other fields for makers
  };

  const { error } = await supabase
    .from('profiles')
    .update(updateData)  // <-- REQUIRES profile to exist!
    .eq('id', user.id);
};
```

**Critical Issue:** Uses `.update()` which requires an existing row. If the trigger failed to create a profile, onboarding will fail with "no rows updated".

---

## Complete Auth Flow Diagram

```
1. User fills signup form
         ↓
2. supabase.auth.signUp() called
         ↓
3. Supabase creates row in auth.users
         ↓
4. TRIGGER: on_auth_user_created FIRES
         ↓
5. handle_new_user() function runs:
   - INSERT into profiles
   - INSERT into subscriptions
   - INSERT into credit_wallets
   - INSERT into point_wallets
   - INSERT into point_transactions
   - INSERT into user_referral_codes
         ↓
6. (IF TRIGGER FAILS → No profile exists)
         ↓
7. Auth.tsx fetches profile with maybeSingle()
         ↓
8. Profile is NULL → navigate to /dashboard anyway
         ↓
9. Dashboard.tsx fetches profile with useProfile()
         ↓
10. Profile is NULL → stuck on loading screen
```

---

## Where Profile Creation Should Happen

According to the current design, profile creation happens:

1. **Primary:** Database trigger `on_auth_user_created` (server-side)
2. **Fallback:** None exists!

**The code does NOT have client-side profile creation fallback.**

---

## Supabase Auth Calls Summary

| File | Call | Purpose |
|------|------|---------|
| AuthContext.tsx:25 | `supabase.auth.onAuthStateChange()` | Listen for auth changes |
| AuthContext.tsx:34 | `supabase.auth.getSession()` | Check existing session |
| AuthContext.tsx:46 | `supabase.auth.signUp()` | Create account |
| AuthContext.tsx:60 | `supabase.auth.signInWithPassword()` | Login |
| AuthContext.tsx:68 | `supabase.auth.signOut()` | Logout |
| AuthContext.tsx:73 | `supabase.auth.resetPasswordForEmail()` | Password reset |
| AuthContext.tsx:80 | `supabase.auth.updateUser()` | Update password |

---

## Profile Queries Summary

| File | Method | Usage |
|------|--------|-------|
| Auth.tsx:54 | `.maybeSingle()` | Check role/onboarding |
| useUserData.ts:13 | `.maybeSingle()` | Fetch full profile |
| useMakerData.ts:415 | `.select()` | List all makers |
| useMakerData.ts:504 | `.single()` | Check if user is maker |
| useAdminData.ts:227 | `.select()` | List all makers for admin |
| Onboarding.tsx:111 | `.update()` | Update profile |
| ProfileSettings.tsx:81 | `.update()` | Update profile |
| MakerProfile.tsx:58 | `.update()` | Update maker profile |
