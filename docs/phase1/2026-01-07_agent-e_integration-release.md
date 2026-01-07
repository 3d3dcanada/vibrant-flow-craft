---
project: 3d3d.ca
phase: Phase 1 Vertical Slice
date: 2026-01-07
owner: Agent E
artifact: Integration, Orchestration & Release Authority Brief
---

# Agent E: Integration, Orchestration & Release Authority

## 1️⃣ SYSTEM INTEGRATION MAP

### Frontend → Backend API Dependencies

| Frontend Component | Backend API | Database Tables | RLS Policies Required | Status |
|-------------------|-------------|-----------------|----------------------|--------|
| **Landing Page - Quote Preview Widget** | `/api/quote/calculate` (client-side) | None (calculation only) | N/A | ⚠️ **BLOCKER**: API not defined |
| **Quote Step 1 - File Upload** | `/storage/v1/object/stl-uploads` | `storage.objects` | `authenticated users can upload` | ⚠️ **BLOCKER**: Storage bucket not configured |
| **Quote Step 1 - STL Analysis** | `/functions/v1/analyze-stl` (fallback) | None | N/A | ⚠️ **BLOCKER**: Edge function not implemented |
| **Quote Step 2-4 - Configuration** | `/api/quote/calculate` | `quotes` (if saving) | `users can CRUD own quotes` | ⚠️ **BLOCKER**: `quotes` table missing |
| **Quote Step 5 - Submit (Guest)** | `POST /api/print-requests` | `print_requests` | `anyone can insert with email` | ✅ Table exists, RLS unknown |
| **Quote Step 5 - Submit (Auth)** | `POST /api/print-requests` | `print_requests`, `credit_wallets`, `credit_transactions` | `users can insert own requests`, `users can read/update own wallet` | ⚠️ **BLOCKER**: RLS policies not verified |
| **Dashboard - Orders** | `GET /api/print-requests?user_id=` | `print_requests`, `print_jobs` | `users can view own requests` | ⚠️ **BLOCKER**: RLS policies not verified |
| **Dashboard - Quotes** | `GET /api/quotes?user_id=` | `quotes` | `users can view own quotes` | ⚠️ **BLOCKER**: `quotes` table missing |
| **Dashboard - Rewards** | `GET /api/rewards/points`, `GET /api/rewards/achievements` | `point_wallets`, `point_transactions`, `achievements`, `user_achievements` | `users can view own points/achievements` | ✅ Tables exist, RLS unknown |
| **Maker Studio - Jobs** | `GET /api/print-jobs?maker_id=`, `PATCH /api/print-jobs/:id` | `print_jobs`, `print_requests` | `makers can view/update claimed jobs` | ⚠️ **BLOCKER**: RLS policies not verified |
| **Maker Studio - Printers** | `GET /api/maker-printers`, `POST /api/maker-printers` | `maker_printers` | `makers can CRUD own printers` | ✅ Table exists, RLS unknown |
| **Maker Studio - Filament** | `GET /api/maker-filament`, `POST /api/maker-filament` | `maker_filament` | `makers can CRUD own filament` | ✅ Table exists, RLS unknown |
| **Maker Studio - Earnings** | `GET /api/payout-requests`, `POST /api/payout-requests` | `payout_requests`, `print_jobs` | `makers can view own payouts` | ✅ Table exists, RLS unknown |
| **Admin Panel - Overview** | `GET /api/admin/stats` | All tables (aggregated) | `admin role required` | ⚠️ **BLOCKER**: Admin RLS not implemented |
| **Navigation - Wallet Display** | `GET /api/credit-wallets/:user_id`, `GET /api/point-wallets/:user_id` | `credit_wallets`, `point_wallets` | `users can view own wallets` | ✅ Tables exist, RLS unknown |
| **Rewards - Achievement Unlock** | Triggered by backend events | `user_achievements`, `point_transactions` | `system can insert achievements` | ⚠️ **BLOCKER**: Trigger logic not implemented |

### Backend → Database Dependencies

| Backend API/Function | Tables Accessed | Triggers Invoked | Edge Functions Called | Status |
|---------------------|-----------------|------------------|----------------------|--------|
| **User Signup Flow** | `auth.users` → `profiles`, `subscriptions`, `credit_wallets`, `point_wallets`, `user_referral_codes` | `on_auth_user_created` → `handle_new_user()` | None | ⚠️ **BLOCKER**: Trigger correctness not verified |
| **Quote Calculation** | `quotes` (if saving), `credit_packages` (for pricing) | None | None | ⚠️ **BLOCKER**: `quotes` table missing |
| **Print Request Submission** | `print_requests`, `point_transactions` (signup bonus if guest converts) | Achievement triggers (if applicable) | None | ⚠️ **BLOCKER**: Achievement triggers not implemented |
| **Job Claim (Maker)** | `print_jobs`, `print_requests`, `point_transactions` | Achievement triggers (first job, 10 jobs, etc.) | None | ⚠️ **BLOCKER**: Achievement triggers not implemented |
| **Payout Request** | `payout_requests`, `print_jobs` (to calculate earnings) | None | None | ✅ Tables exist |
| **Achievement Award** | `user_achievements`, `point_transactions`, `point_wallets` | None | Potentially `award-achievement` edge function | ⚠️ **BLOCKER**: Edge function not implemented |
| **File Upload** | `storage.objects` | None | `analyze-stl` (fallback for large files) | ⚠️ **BLOCKER**: Storage bucket + edge function not configured |

### Rewards Flow → Triggers/Edge Functions

| Event | Trigger Condition | Tables Updated | Points Awarded | Status |
|-------|------------------|----------------|----------------|--------|
| **User Signup** | `auth.users` INSERT | `point_wallets`, `point_transactions` | +100 | ⚠️ **BLOCKER**: Not verified in `handle_new_user()` |
| **First Print Request** | `print_requests` INSERT (first for user) | `user_achievements`, `point_transactions`, `point_wallets` | +50 | ⚠️ **BLOCKER**: Trigger not implemented |
| **First Job Claimed** | `print_jobs` INSERT (first for maker) | `user_achievements`, `point_transactions`, `point_wallets` | +100 | ⚠️ **BLOCKER**: Trigger not implemented |
| **10 Jobs Completed** | `print_jobs` UPDATE (status → completed, count = 10) | `user_achievements`, `point_transactions`, `point_wallets` | +500 | ⚠️ **BLOCKER**: Trigger not implemented |
| **Referral Conversion** | `referrals` INSERT + `print_requests` INSERT | `point_transactions`, `point_wallets` (for referrer) | +200 | ⚠️ **BLOCKER**: Trigger not implemented |
| **Social Share** | `social_shares` INSERT | `point_transactions`, `point_wallets` | +10 | ⚠️ **BLOCKER**: Trigger not implemented |

### Public Pages → Data Dependencies

| Page | Data Required | API Endpoint | Caching Strategy | Status |
|------|--------------|--------------|------------------|--------|
| **Landing Page** | Recent prints (activity feed), maker count, testimonials | `GET /api/activity-feed`, `GET /api/stats/makers` | Static or 5-min cache | ⚠️ **BLOCKER**: APIs not defined |
| **Quote Configurator** | Material pricing, post-processing tiers | Client-side constants or `GET /api/pricing-config` | Static or daily cache | ⚠️ **BLOCKER**: Pricing source not defined |
| **Dashboard** | User profile, wallets, orders, quotes, achievements | Multiple APIs (see above) | No cache (user-specific) | ⚠️ **BLOCKER**: Multiple dependencies |

### Critical Missing Dependencies

**BLOCKERS (Must Resolve Before Integration)**:

1. **`quotes` Table Missing**: Required for saving in-progress quotes (Agent A Step 17, Agent B responsibility)
2. **Storage Bucket Not Configured**: `stl-uploads` bucket must exist with RLS policies
3. **Edge Functions Not Implemented**: `analyze-stl`, `award-achievement`
4. **RLS Policies Not Verified**: Zero evidence of RLS testing on 27 tables
5. **Achievement Triggers Not Implemented**: No database triggers for point awards
6. **API Contracts Not Defined**: No OpenAPI spec, no TypeScript types for request/response shapes
7. **Admin RLS Not Implemented**: Admin panel has no role-based access control

---

## 2️⃣ CONTRACT ALIGNMENT CHECKLIST

### API: `POST /api/print-requests`

| Aspect | Agent A Expectation | Agent B Definition | Status |
|--------|--------------------|--------------------|--------|
| **Request Shape** | `{ file_url: string, material: string, color: string, quantity: number, post_processing?: string, delivery_speed: string, email?: string }` | **UNDEFINED** | ❌ **MISMATCH**: No contract |
| **Response Shape** | `{ id: string, status: string, estimated_completion: string }` | **UNDEFINED** | ❌ **MISMATCH**: No contract |
| **Error Handling** | 400 (validation), 401 (auth), 500 (server) | **UNDEFINED** | ❌ **MISMATCH**: No contract |
| **Loading UI** | Spinner + "Submitting request..." | N/A | ⚠️ **MISSING**: No loading state defined |
| **Failure UI** | Error toast + retry button | N/A | ⚠️ **MISSING**: No error handling defined |

### API: `POST /storage/v1/object/stl-uploads`

| Aspect | Agent A Expectation | Agent B Definition | Status |
|--------|--------------------|--------------------|--------|
| **Request Shape** | `FormData` with file | Supabase Storage standard | ✅ **ALIGNED** |
| **Response Shape** | `{ path: string }` | Supabase Storage standard | ✅ **ALIGNED** |
| **Max File Size** | 50MB | **UNDEFINED** | ❌ **MISMATCH**: No bucket policy |
| **Allowed Extensions** | `.stl`, `.3mf` | **UNDEFINED** | ❌ **MISMATCH**: No bucket policy |
| **Error Handling** | 413 (too large), 415 (invalid type) | Supabase defaults | ⚠️ **PARTIAL**: Need custom validation |
| **Loading UI** | Progress bar (0-100%) | N/A | ✅ **ALIGNED** |
| **Failure UI** | Shake animation + error message | N/A | ✅ **ALIGNED** |

### API: `GET /api/quote/calculate` (Client-Side)

| Aspect | Agent A Expectation | Agent B Definition | Status |
|--------|--------------------|--------------------|--------|
| **Request Shape** | `{ weight_grams: number, material: string, quantity: number, post_processing?: string, delivery_speed: string }` | **UNDEFINED** | ❌ **MISMATCH**: No contract |
| **Response Shape** | `{ platform_fee: number, bed_rental: number, filament_cost: number, post_processing_cost: number, rush_surcharge: number, discount: number, total: number }` | **UNDEFINED** | ❌ **MISMATCH**: No contract |
| **Calculation Logic** | Client-side (for speed) | **UNDEFINED** | ❌ **MISMATCH**: No shared logic |

### API: `GET /api/rewards/points`

| Aspect | Agent A Expectation | Agent B Definition | Status |
|--------|--------------------|--------------------|--------|
| **Request Shape** | `GET /api/rewards/points?user_id={id}` | **UNDEFINED** | ❌ **MISMATCH**: No contract |
| **Response Shape** | `{ balance: number, transactions: Array<{ type: string, amount: number, created_at: string }> }` | **UNDEFINED** | ❌ **MISMATCH**: No contract |
| **Error Handling** | 401 (unauthorized), 404 (user not found) | **UNDEFINED** | ❌ **MISMATCH**: No contract |

### API: `GET /api/rewards/achievements`

| Aspect | Agent A Expectation | Agent B Definition | Status |
|--------|--------------------|--------------------|--------|
| **Request Shape** | `GET /api/rewards/achievements?user_id={id}` | **UNDEFINED** | ❌ **MISMATCH**: No contract |
| **Response Shape** | `{ unlocked: Array<Achievement>, locked: Array<Achievement> }` | **UNDEFINED** | ❌ **MISMATCH**: No contract |

### Critical Contract Gaps

**CANNOT SHIP UNTIL RESOLVED**:

1. **Zero API contracts defined by Agent B** (no OpenAPI spec, no TypeScript types)
2. **No shared TypeScript types** between frontend and backend (risk of runtime errors)
3. **No error response standardization** (frontend cannot reliably handle errors)
4. **No loading/failure UI contracts** (risk of silent failures or infinite spinners)

---

## 3️⃣ INTEGRATION ORDER & MERGE STRATEGY

### Required Merge Order

**Phase 1: Foundation (Week 1-2)**

1. **B1**: Database schema additions (`quotes` table, storage bucket, RLS policies) → **MUST BE FIRST**
2. **B2**: API contracts defined (OpenAPI spec + TypeScript types) → **BLOCKS ALL FRONTEND**
3. **A1**: Design system audit (tokens extraction) → **BLOCKS A2**
4. **A2**: Component library setup (Storybook) → **BLOCKS A3-A7**

**Phase 2: Components (Week 2-3)**

5. **A3-A7**: UI components (GlassPanel, NeonButton, ProgressIndicator, FileUpload, Toast) → **PARALLEL OK**
6. **B3**: File upload API + storage bucket configuration → **BLOCKS A13**
7. **B4**: STL parser integration (client-side + edge function fallback) → **BLOCKS A13**
8. **C1**: Unit test suite setup → **PARALLEL OK**

**Phase 3: Backend Logic (Week 3-4)**

9. **B5**: RLS policy verification + test suite → **BLOCKS ALL DATA ACCESS**
10. **B6**: Database query optimization + indexes → **PARALLEL with B5**
11. **B7-B9**: Rewards framework (triggers, leaderboard, redemption) → **BLOCKS A18 (wallet display)**
12. **B10-B11**: Edge functions (file analysis, achievement award) → **PARALLEL with B7-B9**

**Phase 4: Pages (Week 4-5)**

13. **A8-A12**: Landing page sections → **PARALLEL OK** (depends on A3-A7, D1-D2)
14. **A13-A17**: Quote configurator steps → **SERIAL** (A13 → A14 → A15 → A16 → A17, depends on B2-B4)
15. **D1-D2**: SEO metadata + landing copy → **BLOCKS A8-A12**
16. **C2**: Integration test suite (quote flow E2E) → **BLOCKS A17**

**Phase 5: Dashboards (Week 5-6)**

17. **A18**: Role-aware navigation → **DEPENDS on B7-B9 (wallet data)**
18. **C3**: RLS security tests (all 27 tables) → **BLOCKS PRODUCTION**
19. **C4**: Accessibility audit → **BLOCKS PRODUCTION**
20. **C5**: Performance testing (Lighthouse CI) → **BLOCKS PRODUCTION**

**Phase 6: QA & Launch (Week 6)**

21. **C6**: Load testing (100+ concurrent users) → **BLOCKS PRODUCTION**
22. **C7**: Security audit (OWASP checklist) → **BLOCKS PRODUCTION**
23. **C8**: Cross-browser testing → **BLOCKS PRODUCTION**
24. **D6**: Public launch checklist → **FINAL GATE**

### What Must NEVER Be Merged in Parallel

| Conflict Type | Reason | Resolution |
|--------------|--------|------------|
| **B1 + any frontend data access** | Frontend will fail if tables/policies don't exist | B1 must merge first |
| **B2 + A13-A17** | Frontend cannot consume undefined APIs | B2 must merge first |
| **B5 + any data mutations** | RLS violations will occur | B5 must merge first |
| **A13 → A14 → A15 → A16 → A17** | Quote flow is a single user journey | Must merge serially |
| **C3 + production deploy** | RLS violations are a security breach | C3 must pass first |
| **C5 + production deploy** | Performance regressions will degrade UX | C5 must pass first |

### Branch Strategy

**Branch Naming**: `<type>/<agent>/<ticket>-<short-description>`

Examples:
- `feature/backend/B1-quotes-table`
- `feature/ux/A8-landing-hero`
- `test/qa/C3-rls-security-tests`

**Branch Lifecycle**:
1. Create branch from `main`
2. Implement ticket
3. Run local tests (unit + integration)
4. Push to remote
5. CI runs (Lighthouse, accessibility, RLS tests)
6. Code review (at least one other agent role)
7. Squash merge to `main`
8. Delete branch
9. Deploy to staging
10. Gate approval before production

**Required Checks Before Merge**:
- ✅ All tests passing (unit + integration)
- ✅ Lighthouse score ≥90 (for frontend PRs)
- ✅ No accessibility violations (for frontend PRs)
- ✅ No RLS violations (for backend PRs)
- ✅ Code review approved
- ✅ No merge conflicts
- ✅ Deployment notes documented

**Who Signs Off Each Merge**:
- **Backend PRs (B1-B16)**: Agent C (QA/Security) + Agent E (Integration)
- **Frontend PRs (A1-A18)**: Agent C (QA/Accessibility) + Agent E (Integration)
- **QA PRs (C1-C8)**: Agent E (Integration) + Human Authority
- **Content PRs (D1-D6)**: Agent A (UX) + Agent E (Integration)

---

## 4️⃣ END-TO-END FLOW VERIFICATION

### Flow 1: Guest → Upload → Quote → Submit

**Preconditions**:
- User is not authenticated
- `stl-uploads` storage bucket exists with public upload policy
- `print_requests` table exists with RLS allowing unauthenticated inserts (with email)

**Expected Behavior**:
1. User lands on `/` (landing page)
2. Clicks "Get Instant Quote" → navigates to `/quote`
3. Uploads STL file (drag-drop or click)
   - File validates (extension, size)
   - Client-side STL parser extracts weight, dimensions
   - File uploads to `storage.objects` (progress bar shows 0-100%)
   - Success: Green checkmark, file details displayed
4. Selects material (PLA), color (red), quantity (1)
   - Price updates in real-time (<200ms)
5. Selects delivery speed (Standard)
   - Price updates
6. Reviews price breakdown (Step 4)
   - Platform fee, bed rental, filament cost, total displayed
7. Enters email address
8. Clicks "Submit Request"
   - Loading spinner + "Submitting request..."
   - Backend creates `print_requests` row
   - Backend creates `point_transactions` row (if guest converts later)
   - Success: Redirect to confirmation page
9. Confirmation page shows:
   - Request ID
   - Estimated completion date
   - "Check your email for updates"

**Failure Handling**:
- **File too large**: Error toast "File exceeds 50MB limit. Try compressing your model."
- **Invalid file type**: Shake animation + error toast "Only .stl and .3mf files are supported."
- **Upload fails**: Error toast "Upload failed. Please try again." + retry button
- **Submit fails**: Error toast "Submission failed. Please try again." + retry button
- **Network error**: Error toast "Network error. Check your connection." + retry button

**Evidence Required**:
- ✅ Screenshot: File upload success state
- ✅ Screenshot: Price breakdown (Step 4)
- ✅ Screenshot: Confirmation page
- ✅ Network logs: `POST /storage/v1/object/stl-uploads` (200 OK)
- ✅ Network logs: `POST /api/print-requests` (201 Created)
- ✅ Database query: `SELECT * FROM print_requests WHERE email = 'test@example.com'`

---

### Flow 2: Customer → Quote → Rewards Visibility

**Preconditions**:
- User is authenticated (role: `customer`)
- User has credit balance > 0
- User has point balance > 0
- `quotes` table exists
- `credit_wallets`, `point_wallets` tables exist with RLS

**Expected Behavior**:
1. User logs in → navigates to `/dashboard`
2. Header displays:
   - Credit balance (e.g., "250 credits")
   - Point balance (e.g., "1,250 points")
3. User clicks "New Quote" → navigates to `/quote`
4. Completes quote flow (same as Flow 1, steps 3-6)
5. Step 4 (price breakdown) shows:
   - Total in dollars
   - Total in credits (e.g., "250 credits")
   - Member discount (e.g., "Save $5.00")
6. Step 5 shows:
   - "Pay with Credits" button
   - "Save Quote" button
7. User clicks "Save Quote"
   - Loading spinner
   - Backend creates `quotes` row
   - Success: Redirect to `/dashboard/quotes`
8. Dashboard shows saved quote:
   - File name
   - Material, quantity
   - Total price
   - "Resume" button
9. User navigates to `/dashboard/rewards`
10. Rewards page shows:
    - Point balance (large, gradient text)
    - Recent transactions (list)
    - Unlocked achievements (grid)
    - Locked achievements (grayed out)
    - Leaderboard (top 10 users)

**Failure Handling**:
- **Save quote fails**: Error toast "Failed to save quote. Please try again."
- **Insufficient credits**: "Pay with Credits" button disabled + tooltip "Insufficient credits. You need 250 credits."
- **Rewards API fails**: Skeleton loaders → Error message "Failed to load rewards. Please refresh."

**Evidence Required**:
- ✅ Screenshot: Header with wallet balances
- ✅ Screenshot: Price breakdown with member discount
- ✅ Screenshot: Saved quotes list
- ✅ Screenshot: Rewards page (points, achievements, leaderboard)
- ✅ Network logs: `POST /api/quotes` (201 Created)
- ✅ Network logs: `GET /api/rewards/points` (200 OK)
- ✅ Network logs: `GET /api/rewards/achievements` (200 OK)
- ✅ Database query: `SELECT * FROM quotes WHERE user_id = '{auth.uid()}'`

---

### Flow 3: Maker → Claim Job

**Preconditions**:
- User is authenticated (role: `maker`)
- User has verified maker status (`maker_verified = true`)
- At least one `print_request` exists with status `pending`
- `print_jobs` table exists with RLS

**Expected Behavior**:
1. User logs in → navigates to `/maker/jobs`
2. Jobs page shows:
   - Available requests (list)
   - Each request shows: file name, material, quantity, payout estimate
3. User clicks "Claim Job" on a request
   - Loading spinner
   - Backend creates `print_jobs` row (links to `print_request`)
   - Backend updates `print_request` status to `claimed`
   - Backend awards achievement "First Job Claimed" (if first job)
   - Backend creates `point_transactions` row (+100 points)
   - Success: Job moves to "Active Jobs" section
4. User clicks on active job → navigates to `/maker/jobs/:id`
5. Job detail page shows:
   - File preview (if possible)
   - Material, quantity, delivery deadline
   - "Update Status" dropdown (printing, completed)
   - "Upload Photos" button
6. User selects "Completed" → uploads photos
   - Loading spinner
   - Backend updates `print_jobs` status to `completed`
   - Backend creates `payout_requests` row
   - Success: Toast "Job completed! Payout request submitted."
7. User navigates to `/maker/earnings`
8. Earnings page shows:
   - Total earnings (all-time)
   - Pending payouts (list)
   - Completed payouts (list)

**Failure Handling**:
- **Claim fails (already claimed)**: Error toast "This job was already claimed by another maker."
- **Update status fails**: Error toast "Failed to update status. Please try again."
- **Photo upload fails**: Error toast "Photo upload failed. Please try again."

**Evidence Required**:
- ✅ Screenshot: Available jobs list
- ✅ Screenshot: Job detail page
- ✅ Screenshot: Completed job + toast notification
- ✅ Screenshot: Earnings page
- ✅ Network logs: `POST /api/print-jobs` (201 Created)
- ✅ Network logs: `PATCH /api/print-jobs/:id` (200 OK)
- ✅ Network logs: `POST /api/payout-requests` (201 Created)
- ✅ Database query: `SELECT * FROM print_jobs WHERE maker_id = '{auth.uid()}'`
- ✅ Database query: `SELECT * FROM user_achievements WHERE user_id = '{auth.uid()}' AND achievement_id = 'first-job-claimed'`

---

### Flow 4: Admin → Overview Sanity Check

**Preconditions**:
- User is authenticated (role: `admin`)
- Admin RLS policies exist (role-based access control)
- `site_settings` table exists

**Expected Behavior**:
1. User logs in → navigates to `/admin`
2. Overview page shows:
   - Total users (count)
   - Total requests (count)
   - Total jobs (count)
   - Total payouts (sum)
   - Recent activity (list of last 10 events)
3. User navigates to `/admin/users`
4. Users page shows:
   - Searchable/filterable table
   - Columns: email, role, created_at, onboarding_completed
   - "Edit" button per user
5. User clicks "Edit" on a maker
   - Modal opens with user details
   - "Verify Maker" button (if not verified)
6. User clicks "Verify Maker"
   - Loading spinner
   - Backend updates `profiles.maker_verified = true`
   - Success: Toast "Maker verified!"

**Failure Handling**:
- **Unauthorized access**: Redirect to `/dashboard` + error toast "Admin access required."
- **Stats API fails**: Skeleton loaders → Error message "Failed to load stats. Please refresh."
- **Update fails**: Error toast "Failed to update user. Please try again."

**Evidence Required**:
- ✅ Screenshot: Admin overview page
- ✅ Screenshot: Users table
- ✅ Screenshot: User edit modal
- ✅ Network logs: `GET /api/admin/stats` (200 OK)
- ✅ Network logs: `GET /api/admin/users` (200 OK)
- ✅ Network logs: `PATCH /api/admin/users/:id` (200 OK)
- ✅ Database query: `SELECT * FROM profiles WHERE role = 'admin'` (verify RLS allows)

---

## 5️⃣ ENVIRONMENT & CONFIG VERIFICATION

### Required Environment Variables

| Variable | Purpose | Required For | Default | Validation |
|----------|---------|--------------|---------|------------|
| `VITE_SUPABASE_URL` | Supabase project URL | All API calls | None | Must start with `https://` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Client-side auth | None | Must be valid JWT |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Edge functions, admin operations | None | Must be valid JWT (server-side only) |
| `VITE_APP_URL` | Frontend URL | OAuth redirects, email links | `http://localhost:5173` | Must be valid URL |
| `VITE_STORAGE_BUCKET` | Storage bucket name | File uploads | `stl-uploads` | Must exist in Supabase |

### Supabase Project Settings

| Setting | Required Value | Current Value | How to Verify | What Breaks if Misconfigured |
|---------|---------------|---------------|---------------|------------------------------|
| **Auth - Email Confirmations** | Disabled (for dev), Enabled (for prod) | **UNKNOWN** | Supabase Dashboard → Auth → Settings | Users cannot sign up (stuck waiting for email) |
| **Auth - Email Templates** | Custom templates with `{{ .ConfirmationURL }}` | **UNKNOWN** | Supabase Dashboard → Auth → Email Templates | Confirmation emails have broken links |
| **Auth - Redirect URLs** | `http://localhost:5173/auth/callback`, `https://3d3d.ca/auth/callback` | **UNKNOWN** | Supabase Dashboard → Auth → URL Configuration | OAuth fails with "redirect_uri mismatch" |
| **Storage - stl-uploads Bucket** | Exists, public upload, 50MB max | **DOES NOT EXIST** | Supabase Dashboard → Storage | File uploads fail with 404 |
| **Storage - RLS Policies** | `authenticated users can upload`, `anyone can read` | **NOT CONFIGURED** | Supabase Dashboard → Storage → Policies | Uploads fail with 403 Forbidden |
| **Database - RLS Enabled** | Enabled on all 27 tables | **UNKNOWN** | `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'` | Data leaks or unauthorized access |
| **Database - Triggers** | `on_auth_user_created` exists and fires | **UNKNOWN** | `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created'` | New users have no profile/wallet |
| **Edge Functions - Deployed** | `analyze-stl`, `award-achievement` deployed | **NOT DEPLOYED** | `supabase functions list` | Large file uploads fail, achievements don't award |

### What Breaks if Misconfigured

| Misconfiguration | Symptom | Detection Method |
|------------------|---------|------------------|
| **Missing `VITE_SUPABASE_URL`** | App crashes on load with "Supabase client not initialized" | Browser console error |
| **Invalid `VITE_SUPABASE_ANON_KEY`** | All API calls fail with 401 Unauthorized | Network tab shows 401 responses |
| **Storage bucket doesn't exist** | File uploads fail with 404 Not Found | Network tab shows `POST /storage/v1/object/stl-uploads` → 404 |
| **RLS not enabled** | Data leaks (users can see other users' data) | Manual test: Create user A, query user B's data |
| **RLS too restrictive** | Users cannot access their own data | Network tab shows 403 Forbidden on legitimate requests |
| **Trigger not firing** | New users have no profile | Database query: `SELECT * FROM auth.users au LEFT JOIN profiles p ON au.id = p.id WHERE p.id IS NULL` |
| **Edge function not deployed** | Large file uploads fail or timeout | Network tab shows `POST /functions/v1/analyze-stl` → 404 |
| **Auth redirect URL mismatch** | OAuth fails with error page | Browser shows "redirect_uri mismatch" error |

### How to Detect Misconfiguration Early

**Pre-Deployment Checklist**:
1. Run `supabase status` → verify project URL and keys
2. Run `supabase db dump` → verify all 27 tables exist
3. Run `supabase storage ls` → verify `stl-uploads` bucket exists
4. Run `supabase functions list` → verify edge functions deployed
5. Run SQL query: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'` → verify RLS enabled
6. Run SQL query: `SELECT * FROM pg_policies` → verify RLS policies exist
7. Run SQL query: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created'` → verify trigger exists
8. Manual test: Sign up new user → verify profile created
9. Manual test: Upload file → verify storage upload succeeds
10. Manual test: Submit print request → verify database insert succeeds

---

## 6️⃣ RELEASE CANDIDATE CHECKLIST (GO / NO-GO)

### Agent A: UX Readiness

- [ ] **A1-A18**: All 18 tickets closed and merged
- [ ] **Component Library**: Storybook deployed with 8+ components documented
- [ ] **Landing Page**: Hero, trust indicators, how it works, quote preview, testimonials live
- [ ] **Quote Configurator**: All 5 steps functional (upload, material, quantity, breakdown, checkout)
- [ ] **Navigation**: Role-aware header, mobile nav, breadcrumbs implemented
- [ ] **Dark/Light Mode**: Toggle functional, all components support both modes
- [ ] **Accessibility**: WCAG 2.1 AA compliant (axe-core reports zero violations)
- [ ] **Performance**: Lighthouse score ≥90 on all pages
- [ ] **Responsive**: Tested on 320px, 768px, 1024px, 1920px
- [ ] **No Dead UI**: All buttons/links functional or explicitly disabled with tooltips
- [ ] **No Fake Success**: All success states reflect real backend operations

**IF ANY ITEM FAILS → NO-GO**

---

### Agent B: Backend Readiness

- [ ] **B1-B16**: All 16 tickets closed and merged
- [ ] **Database Schema**: `quotes` table exists, all 27 tables have RLS enabled
- [ ] **Storage Bucket**: `stl-uploads` bucket exists with correct policies (50MB max, .stl/.3mf only)
- [ ] **Edge Functions**: `analyze-stl`, `award-achievement` deployed and functional
- [ ] **API Contracts**: OpenAPI spec published, TypeScript types shared with frontend
- [ ] **RLS Policies**: 100% coverage on all tables, automated test suite passing
- [ ] **Triggers**: `on_auth_user_created` fires correctly, achievement triggers functional
- [ ] **Pricing Logic**: Quote calculation accurate (unit tests passing)
- [ ] **Rewards Framework**: Points awarded correctly, leaderboard functional
- [ ] **Performance**: All queries <200ms (95th percentile)
- [ ] **Security**: Rate limiting enabled, input validation on all endpoints

**IF ANY ITEM FAILS → NO-GO**

---

### Agent C: Gate Pass

- [ ] **C1**: Unit test suite passing (100% of critical paths)
- [ ] **C2**: Integration test suite passing (quote flow E2E)
- [ ] **C3**: RLS security tests passing (all 27 tables, zero violations)
- [ ] **C4**: Accessibility audit passing (WCAG 2.1 AA, zero violations)
- [ ] **C5**: Performance testing passing (Lighthouse ≥90 all pages)
- [ ] **C6**: Load testing passing (100+ concurrent users, zero errors)
- [ ] **C7**: Security audit passing (OWASP checklist, no critical/high vulnerabilities)
- [ ] **C8**: Cross-browser testing passing (Chrome, Firefox, Safari, Edge)

**IF ANY ITEM FAILS → NO-GO**

---

### Agent D: Public-Facing Accuracy

- [ ] **D1**: SEO metadata on all pages (title, description, OG tags)
- [ ] **D2**: Landing page copy finalized (value prop, trust indicators, CTAs)
- [ ] **D3**: Knowledge hub structure defined (FAQ, guides) - **DEFERRED TO PHASE 2**
- [ ] **D4**: Fredericton local landing strategy implemented
- [ ] **D5**: Privacy-first analytics setup (Plausible/Fathom)
- [ ] **D6**: Public launch checklist complete

**IF D1, D2, D4, D5, D6 FAIL → NO-GO**

---

### Build Health

- [ ] **CI/CD Pipeline**: All checks passing (lint, typecheck, build, test)
- [ ] **No Build Warnings**: Zero TypeScript errors, zero ESLint warnings
- [ ] **No Console Errors**: Zero errors in browser console on any page
- [ ] **No Network Errors**: All API calls return 2xx or expected error codes
- [ ] **Bundle Size**: Initial JS <200KB gzipped, CSS <50KB gzipped
- [ ] **Dependencies**: No known vulnerabilities (npm audit reports zero high/critical)

**IF ANY ITEM FAILS → NO-GO**

---

### No Dead UI

- [ ] **All Buttons Functional**: Every button either works or is disabled with tooltip
- [ ] **All Links Functional**: Every link navigates or is disabled
- [ ] **All Forms Functional**: Every form submits or shows validation errors
- [ ] **No Placeholder Content**: No "Lorem ipsum", no "Coming soon" in production
- [ ] **No Mock Data**: All data comes from real backend or is clearly labeled as demo

**IF ANY ITEM FAILS → NO-GO**

---

### No Known Blockers

- [ ] **Zero Critical Bugs**: No P0/P1 bugs in issue tracker
- [ ] **Zero Security Vulnerabilities**: No unresolved OWASP issues
- [ ] **Zero RLS Violations**: Automated tests confirm no data leaks
- [ ] **Zero Accessibility Violations**: Automated + manual tests confirm WCAG AA
- [ ] **Zero Performance Regressions**: Lighthouse scores stable or improving

**IF ANY ITEM FAILS → NO-GO**

---

## 7️⃣ ROLLBACK & INCIDENT PLAN (PHASE 1)

### What to Roll Back if Release Fails

| Failure Scenario | Rollback Action | Rollback Time | Data Loss Risk |
|------------------|----------------|---------------|----------------|
| **Critical Frontend Bug** | Revert to previous `main` commit, redeploy | <5 minutes | None (backend unchanged) |
| **Critical Backend Bug** | Revert database migration, redeploy previous edge functions | <15 minutes | Possible (if migration altered data) |
| **RLS Violation Discovered** | Disable affected table (set all policies to DENY), investigate | <2 minutes | None (prevents further leaks) |
| **Performance Regression** | Revert to previous `main` commit, redeploy | <5 minutes | None |
| **Security Breach** | Disable auth (set Supabase to maintenance mode), investigate | <1 minute | None (prevents further damage) |
| **Database Corruption** | Restore from latest backup (Supabase automatic backups) | <30 minutes | Up to 1 hour of data |

### How to Disable Features Safely

| Feature | Disable Method | User Impact | Rollback Complexity |
|---------|---------------|-------------|---------------------|
| **Quote Configurator** | Set feature flag `VITE_ENABLE_QUOTES=false`, show "Under maintenance" message | Users cannot submit quotes | Low (toggle env var) |
| **Rewards System** | Disable achievement triggers (set `ENABLE_ACHIEVEMENTS=false` in edge function) | Users don't earn points | Low (toggle env var) |
| **File Upload** | Set storage bucket to private (RLS policy: DENY ALL) | Users cannot upload files | Medium (requires Supabase dashboard) |
| **Maker Job Claims** | Set RLS policy on `print_jobs` to DENY INSERT | Makers cannot claim jobs | Medium (requires SQL migration) |
| **Admin Panel** | Set RLS policy on admin routes to DENY ALL | Admins cannot access panel | Medium (requires SQL migration) |

### What Logs/Signals Indicate Rollback is Needed

| Signal | Threshold | Action | Monitoring Tool |
|--------|-----------|--------|----------------|
| **Error Rate Spike** | >5% of requests return 5xx | Immediate rollback | Supabase Logs, Sentry |
| **RLS Violation Detected** | Any unauthorized data access | Immediate rollback + disable table | Automated RLS tests |
| **Performance Degradation** | LCP >5s or 95th percentile query time >1s | Investigate, rollback if critical | Lighthouse CI, Supabase Metrics |
| **User Reports** | >10 reports of same issue in <1 hour | Investigate, rollback if confirmed | Support tickets, social media |
| **Security Alert** | Any OWASP critical vulnerability detected | Immediate rollback + patch | OWASP ZAP, manual audit |

### Rollback Procedure

**Step 1: Identify Failure**
- Monitor Supabase logs for 5xx errors
- Monitor Sentry for frontend errors
- Monitor support tickets for user reports
- Monitor Lighthouse CI for performance regressions

**Step 2: Assess Severity**
- **P0 (Critical)**: Security breach, data leak, site down → Immediate rollback
- **P1 (High)**: Major feature broken, performance regression → Rollback within 1 hour
- **P2 (Medium)**: Minor feature broken, cosmetic issue → Fix forward or rollback within 24 hours
- **P3 (Low)**: Minor bug, no user impact → Fix forward in next release

**Step 3: Execute Rollback**
- **Frontend**: `git revert <commit>`, `git push`, redeploy to Vercel/Netlify
- **Backend**: `supabase db reset --db-url <prod-url>` (restores to last migration), redeploy edge functions
- **Storage**: Revert bucket policies via Supabase dashboard
- **Auth**: Revert auth settings via Supabase dashboard

**Step 4: Verify Rollback**
- Run smoke tests (login, quote flow, file upload)
- Check Supabase logs for errors
- Monitor Lighthouse CI for performance
- Confirm user reports stop

**Step 5: Post-Mortem**
- Document failure cause
- Document rollback actions taken
- Document prevention measures
- Update runbook

---

## 8️⃣ FINAL SIGN-OFF CONDITIONS

### Evidence Agent E Requires to Approve Release

**1. Automated Test Reports**:
- [ ] Unit test suite: 100% passing (screenshot of test output)
- [ ] Integration test suite: 100% passing (screenshot of E2E test results)
- [ ] RLS security tests: 100% passing (screenshot of SQL test output)
- [ ] Accessibility tests: Zero violations (screenshot of axe-core report)
- [ ] Performance tests: Lighthouse ≥90 all pages (screenshot of Lighthouse CI)
- [ ] Load tests: 100+ concurrent users, zero errors (screenshot of load test results)
- [ ] Security audit: Zero critical/high vulnerabilities (screenshot of OWASP report)
- [ ] Cross-browser tests: Passing on Chrome, Firefox, Safari, Edge (screenshots)

**2. Manual Verification Evidence**:
- [ ] Screenshot: Guest quote flow (all 5 steps + confirmation)
- [ ] Screenshot: Customer quote flow (with member discount + wallet display)
- [ ] Screenshot: Maker job claim flow (claim + update status + earnings)
- [ ] Screenshot: Admin panel (overview + user edit)
- [ ] Screenshot: Rewards page (points, achievements, leaderboard)
- [ ] Screenshot: Landing page (all sections)
- [ ] Screenshot: Mobile responsive (320px, 768px)
- [ ] Screenshot: Dark mode (all pages)

**3. Database Verification**:
- [ ] SQL query result: All 27 tables exist
- [ ] SQL query result: RLS enabled on all tables
- [ ] SQL query result: All RLS policies exist (screenshot of `SELECT * FROM pg_policies`)
- [ ] SQL query result: Trigger `on_auth_user_created` exists and fires
- [ ] SQL query result: Sample data (1 user, 1 print_request, 1 print_job, 1 achievement)

**4. API Contract Documentation**:
- [ ] OpenAPI spec published (link to Swagger UI or Redoc)
- [ ] TypeScript types shared between frontend/backend (link to GitHub)
- [ ] Error response standardization documented (link to docs)

**5. Deployment Verification**:
- [ ] Staging deployment successful (link to staging URL)
- [ ] Production deployment plan documented (link to runbook)
- [ ] Rollback plan tested (screenshot of successful rollback in staging)
- [ ] Environment variables verified (screenshot of `.env` file with sensitive values redacted)

---

### What Automatically Blocks Approval

**HARD BLOCKS (No Exceptions)**:
- ❌ Any RLS violation detected (automated or manual)
- ❌ Any WCAG AA violation detected (automated or manual)
- ❌ Lighthouse Performance score <85 on any page
- ❌ Any critical security vulnerability (CVSS ≥7.0)
- ❌ Any P0/P1 bug unresolved
- ❌ Any dead UI (non-functional buttons/links)
- ❌ Any fake success states (UI shows success but backend fails)
- ❌ Missing API contracts (no OpenAPI spec or TypeScript types)
- ❌ Missing storage bucket or edge functions
- ❌ Missing `quotes` table
- ❌ Trigger `on_auth_user_created` not firing
- ❌ Any agent (A, B, C, D) has incomplete tickets

---

### What Requires Escalation to Human Authority

**ESCALATION TRIGGERS**:
- ⚠️ Any SOFT BLOCK that cannot be resolved within 24 hours
- ⚠️ Disagreement between agents on readiness
- ⚠️ Scope change request (adding/removing features)
- ⚠️ Timeline slip >1 week
- ⚠️ Budget overrun (if applicable)
- ⚠️ Legal/compliance concerns (privacy, accessibility)
- ⚠️ Third-party dependency failure (Supabase outage, etc.)

**ESCALATION PROCESS**:
1. Agent E documents the issue in `docs/escalations/YYYY-MM-DD_<issue>.md`
2. Agent E notifies human authority via agreed channel (email, Slack, etc.)
3. Human authority reviews issue and provides decision within 48 hours
4. Agent E documents decision and proceeds accordingly

---

## VERIFICATION RULE

**Integration is APPROVED if and only if**:

1. ✅ All 48 tickets (A1-A18, B1-B16, C1-C8, D1-D6) are closed and merged
2. ✅ All 4 end-to-end flows (Guest, Customer, Maker, Admin) are demonstrated with evidence
3. ✅ All automated tests pass (unit, integration, RLS, accessibility, performance, load, security, cross-browser)
4. ✅ All manual verification evidence provided (screenshots, SQL queries, API docs)
5. ✅ Zero HARD BLOCKS active
6. ✅ Staging deployment successful
7. ✅ Rollback plan tested and documented
8. ✅ All agents (A, B, C, D) sign off on their respective domains
9. ✅ Agent E signs off on integration readiness
10. ✅ Human authority signs off on production deployment (if required)

**Integration is BLOCKED if**:

- ❌ Any HARD BLOCK is active
- ❌ Any agent has incomplete tickets
- ❌ Any end-to-end flow cannot be demonstrated
- ❌ Any automated test fails
- ❌ Missing evidence (screenshots, SQL queries, API docs)
- ❌ Staging deployment fails
- ❌ Rollback plan not tested

---

## FAILURE CONDITIONS

**This task is FAILED if Agent E**:

- ❌ Allows mismatched contracts (frontend expects API that doesn't exist)
- ❌ Skips Agent C gates (deploys without passing tests)
- ❌ Approves release with known dead paths (non-functional UI)
- ❌ Assumes environment correctness (doesn't verify storage bucket, edge functions, RLS)
- ❌ Asks the user questions (Agent E is autonomous, not interactive)

---

## CURRENT STATUS ASSESSMENT

**As of 2026-01-07**:

### ✅ COMPLETED
- Master Plan defined (6-week roadmap, 48 tickets, dependency graph)
- Agent A UX/Frontend brief complete (component specs, page layouts, accessibility requirements)
- Database schema exists (27 tables from migrations)
- Frontend codebase exists (React, TypeScript, Tailwind, shadcn/ui)
- Supabase project exists (auth, database, storage)

### ⚠️ BLOCKERS (CRITICAL)
1. **Agent B brief missing**: No backend implementation plan, no API contracts, no RLS verification plan
2. **Agent C brief missing**: No QA/security/performance plan, no test suite specs
3. **Agent D brief missing**: No SEO/content/growth plan
4. **`quotes` table missing**: Required for saving in-progress quotes
5. **Storage bucket not configured**: `stl-uploads` bucket does not exist
6. **Edge functions not implemented**: `analyze-stl`, `award-achievement` not deployed
7. **RLS policies not verified**: Zero evidence of RLS testing on 27 tables
8. **API contracts not defined**: No OpenAPI spec, no TypeScript types
9. **Achievement triggers not implemented**: No database triggers for point awards
10. **Admin RLS not implemented**: Admin panel has no role-based access control

### 📋 NEXT STEPS (REQUIRED BEFORE INTEGRATION)
1. **Agent B must deliver**: `docs/phase1/2026-01-07_agent-b_backend.md` (API contracts, RLS plan, rewards framework)
2. **Agent C must deliver**: `docs/phase1/2026-01-07_agent-c_qa-security.md` (test suite specs, security audit plan)
3. **Agent D must deliver**: `docs/phase1/2026-01-07_agent-d_growth-seo.md` (SEO metadata, landing copy, analytics)
4. **Agent B must implement**: B1 (database schema additions), B2 (API contracts), B3 (storage bucket), B5 (RLS verification)
5. **Agent E must verify**: All blockers resolved before approving any integration work

---

**AGENT E EXECUTION COMPLETE.**

**RELEASE STATUS: BLOCKED**

**BLOCKERS MUST BE RESOLVED BEFORE PHASE 1 INTEGRATION CAN BEGIN.**
