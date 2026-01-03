# Audit Findings - 3D3D Canada

**Date:** 2026-01-03
**Auditor:** Claude (Automated Audit)
**Severity Levels:** CRITICAL, HIGH, MEDIUM, LOW

---

## CRITICAL ISSUES

### 1. Missing Profile Row for admin@3d3d.ca

**Severity:** CRITICAL
**Impact:** Founder cannot access admin dashboard

**Problem:**
- User exists in `auth.users` table
- No corresponding row in `profiles` table
- Dashboard shows infinite loading because `profile` is `null`

**Root Cause (Most Likely):**
1. User signed up BEFORE the trigger migration was applied to production, OR
2. Trigger function `handle_new_user()` failed silently during signup

**Evidence:**
- Auth flow uses `maybeSingle()` which returns `null` for missing profiles
- Dashboard.tsx only redirects when `profile` is truthy
- No error handling or fallback for missing profiles

---

### 2. No Client-Side Fallback for Profile Creation

**Severity:** CRITICAL
**Impact:** Any user with a missing profile is permanently stuck

**Problem:**
- If the database trigger fails, no profile is created
- The application has NO fallback to create profiles client-side
- Users are stuck on the dashboard loading screen indefinitely

**Affected Code:**
- `src/pages/Dashboard.tsx:35` - Redirects only if profile exists
- `src/pages/Auth.tsx:57` - Continues to dashboard even without profile
- `src/pages/Onboarding.tsx:110` - Uses UPDATE (requires existing row)

---

### 3. Onboarding Uses UPDATE Instead of UPSERT

**Severity:** HIGH
**Impact:** Onboarding fails for users without profiles

**Problem:**
```typescript
// Onboarding.tsx:110
const { error } = await supabase
  .from('profiles')
  .update(updateData)  // <-- Fails if row doesn't exist!
  .eq('id', user.id);
```

**Solution Needed:** Use `upsert()` instead of `update()`.

---

## HIGH ISSUES

### 4. Trigger Function Has No Error Handling

**Severity:** HIGH
**Impact:** Silent failures leave users without profiles

**Problem:**
The `handle_new_user()` function has no try/catch or error logging:

```sql
-- Current: No error handling
INSERT INTO public.profiles (...) VALUES (...);
INSERT INTO public.subscriptions (...) VALUES (...);
-- If any fails, entire function fails silently
```

**Recommendation:**
Add error handling and logging to identify failures:

```sql
BEGIN
  -- inserts
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
  RAISE;
END;
```

---

### 5. is_admin() and is_maker() Return False for Missing Profiles

**Severity:** HIGH
**Impact:** Admin RLS policies fail for users without profiles

**Problem:**
```sql
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'admin'
  )
$$;
```

If no profile exists, this returns `false`, even for legitimate admins.

---

### 6. Role Column Not Included in Trigger

**Severity:** MEDIUM
**Impact:** New users rely entirely on column defaults

**Problem:**
The trigger function only sets basic fields:
```sql
INSERT INTO public.profiles (id, email, full_name)
VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
```

It doesn't set:
- `role` (defaults to 'customer')
- `onboarding_completed` (defaults to false)

**This is fine for normal users** but means admins must be manually updated.

---

## MEDIUM ISSUES

### 7. No Admin Bootstrapping Mechanism

**Severity:** MEDIUM
**Impact:** No way to create first admin through normal flow

**Problem:**
- Normal signup creates users with role='customer'
- There's no secure way to bootstrap the first admin
- Must manually UPDATE the database

**Recommendation:**
Create a secure admin bootstrap migration or use Supabase Auth metadata.

---

### 8. Profile Fetch Uses maybeSingle() Without Null Handling

**Severity:** MEDIUM
**Impact:** Code silently proceeds with null profile

**Problem:**
```typescript
// Auth.tsx:54
.maybeSingle()
.then(({ data, error }) => {
  if (error) { /* handle error */ }
  if (data?.onboarding_completed === false) { /* ... */ }
  navigate('/dashboard');  // <-- Happens even if data is null!
});
```

---

### 9. RLS INSERT Policy May Be Redundant

**Severity:** LOW
**Impact:** Confusion about intended behavior

**Problem:**
```sql
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

This policy exists but profiles are created by a `SECURITY DEFINER` trigger function which bypasses RLS. The policy is redundant.

---

## Orphaned/Unclear Tables

### Tables That May Be Orphaned:

| Table | Status | Notes |
|-------|--------|-------|
| `makers` | **NOT FOUND** | Referenced in task but doesn't exist in schema |
| `site_settings` | OK | Global config (single row) |
| `promo_products` | OK | Used for promotional items |
| `store_items` | OK | General store inventory |

**Note:** The task mentioned a `makers` table, but this doesn't exist. Maker data is stored in the `profiles` table with `role='maker'`.

---

## Missing Foreign Key Relationships

### Tables Referencing auth.users Correctly:
All tables properly reference `auth.users(id)` with `ON DELETE CASCADE` or `ON DELETE SET NULL`.

### No Issues Found:
The schema properly uses foreign keys throughout.

---

## RLS Policies That May Block Operations

### 1. profiles INSERT policy
- **Concern:** Requires `auth.uid() = id`
- **Actual Impact:** None - trigger uses SECURITY DEFINER

### 2. recycling_drops and social_shares
- **Concern:** INSERT policies were removed in migration 6
- **Actual Impact:** Intentional - these require edge functions now

---

## Triggers That Should Fire But May Not

### on_auth_user_created

**Trigger Definition:**
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Possible Failure Modes:**

1. **Trigger not created** - Migration not applied
2. **Function doesn't exist** - Dependency issue
3. **Function fails silently** - No error handling
4. **RLS blocks inserts** - Shouldn't happen with SECURITY DEFINER
5. **Column mismatch** - Schema drift between migrations

---

## Auth Flow Gaps

### Gap 1: No Profile Creation Fallback

```
Auth.users INSERT → Trigger fires → Profile created
                          ↓
                    (IF FAILS)
                          ↓
                   NO FALLBACK!
                          ↓
                  User stuck forever
```

### Gap 2: Dashboard Assumes Profile Exists

```typescript
// Dashboard.tsx
if (profile) {
  // Redirect based on role
} else {
  // NOTHING HAPPENS - stuck on loading
}
```

### Gap 3: Onboarding Requires Existing Profile

```typescript
// Onboarding.tsx
await supabase.from('profiles').update(...)  // Fails if no row!
```

---

## Summary by Severity

| Severity | Count | Issues |
|----------|-------|--------|
| CRITICAL | 2 | Missing profile, no fallback |
| HIGH | 3 | Trigger errors, is_admin fails, UPDATE vs UPSERT |
| MEDIUM | 3 | No bootstrap, null handling, redundant policy |
| LOW | 0 | - |

**Total Issues:** 8
