---
project: 3d3d.ca
phase: Phase 1 Vertical Slice
date: 2026-01-07
owner: Agent C
artifact: QA, Security & Performance Gatekeeper Brief
---

# QA, Security & Performance Gatekeeper Brief
## Phase 1 Vertical Slice — 3d3d.ca

**Authority:** Agent C has final veto power on production deployment.  
**Standard:** Zero critical failures. No exceptions.  
**Protocol:** PulZ STRICT / GATEKEEPER AUTHORITY

---

## 1️⃣ QUALITY GATES → EXECUTABLE CHECKS

### Gate 1: Design Approval (Truthful UI + Accessibility Intent)

**What is being validated:**  
UI components accurately represent backend state. No fake success states. Disabled actions explain why. Accessibility patterns documented.

**Exact metric / condition:**
- Zero "silent no-op" buttons (all buttons either work or show disabled state with tooltip)
- Zero optimistic UI updates without backend confirmation
- All error states render visible, actionable messages
- Keyboard navigation documented for critical flows (quote, checkout, dashboard)

**Tool or method used:**
- Manual UI audit with checklist (Section 7)
- Browser DevTools inspection
- Keyboard-only navigation test
- Screen reader spot check (NVDA/JAWS)

**Pass threshold:**
- 100% of interactive elements are truthful (work or explain why disabled)
- All error states tested and visible
- Keyboard navigation functional for quote flow

**Fail threshold:**
- Any button that does nothing without explanation
- Any error swallowed silently
- Any keyboard trap or unreachable interactive element

**Evidence artifact produced:**
- `docs/phase1/truthful-ui-audit-YYYY-MM-DD.md` with screenshots
- Video recording of keyboard navigation test
- List of disabled states with tooltip text

**Status:** NOT VERIFIED — Gate blocks deployment until complete.

---

### Gate 2: API Contract Freeze (No Drift)

**What is being validated:**  
Frontend and backend API contracts match exactly. No undocumented changes. TypeScript types align with actual responses.

**Exact metric / condition:**
- `calculate-quote` Edge Function request/response matches documented contract
- `GET /rest/v1/quotes` response schema matches TypeScript types
- `POST /rest/v1/print_requests` accepts documented payload
- All error codes (400, 429, 500) return documented error structure

**Tool or method used:**
- Automated contract testing (Postman/Newman or Deno tests)
- TypeScript type checking against actual API responses
- Manual API calls with documented examples

**Pass threshold:**
- 100% of documented API examples execute successfully
- Zero TypeScript type errors when consuming API responses
- All error codes tested and match documentation

**Fail threshold:**
- Any API response that doesn't match documented schema
- Any undocumented field in response
- Any documented field missing from response

**Evidence artifact produced:**
- `supabase/functions/calculate-quote/contract.test.ts` (passing)
- Postman collection with all examples (exported JSON)
- `docs/phase1/api-contract-verification-YYYY-MM-DD.md`

**Status:** NOT VERIFIED — Gate blocks deployment until complete.

---

### Gate 3: Component Library Completion

**What is being validated:**  
All UI components used in Phase 1 are complete, tested, and documented. No placeholder components in production.

**Exact metric / condition:**
- Quote calculator component fully functional
- Pricing breakdown component displays all line items
- Multi-quote list component renders and allows selection
- Admin verification workflow components operational
- All components have defined props and TypeScript types

**Tool or method used:**
- Component inventory checklist
- Storybook or component documentation review
- Manual testing of each component in isolation

**Pass threshold:**
- 100% of Phase 1 components functional
- Zero "TODO" or "PLACEHOLDER" comments in production code
- All components accept documented props

**Fail threshold:**
- Any component that renders but doesn't function
- Any hardcoded mock data in production components
- Any missing required props causing runtime errors

**Evidence artifact produced:**
- `docs/phase1/component-inventory-YYYY-MM-DD.md`
- Screenshots of each component in use
- List of components with prop signatures

**Status:** NOT VERIFIED — Gate blocks deployment until complete.

---

### Gate 4: Quote Flow Performance

**What is being validated:**  
End-to-end quote flow completes within performance budget. No user-perceptible delays.

**Exact metric / condition:**
- Quote calculation (frontend + backend) < 3 seconds (p95)
- Quote retrieval from database < 500ms (p95)
- Quote list rendering < 200ms (p95)
- Page load (quote page) < 2 seconds on Fast 3G (Lighthouse)

**Tool or method used:**
- Chrome DevTools Performance tab
- Lighthouse CI (automated)
- Manual stopwatch timing
- Supabase Dashboard query performance metrics

**Pass threshold:**
- p95 quote calculation < 3s
- p95 quote retrieval < 500ms
- Lighthouse Performance score ≥ 90

**Fail threshold:**
- p95 quote calculation > 5s
- p95 quote retrieval > 1s
- Lighthouse Performance score < 80

**Evidence artifact produced:**
- `docs/phase1/performance-report-YYYY-MM-DD.json` (Lighthouse)
- Chrome DevTools Performance trace (exported)
- Supabase query performance screenshots

**Status:** NOT VERIFIED — Gate blocks deployment until complete.

---

### Gate 5: Security & RLS Integrity

**What is being validated:**  
Row-Level Security policies prevent unauthorized access. No privilege escalation. No data leaks.

**Exact metric / condition:**
- Customer cannot view other customers' quotes
- Customer cannot view admin-only data
- Maker cannot modify customer data
- Guest cannot access authenticated-only endpoints
- Admin RLS policies tested for all tables

**Tool or method used:**
- SQL-based RLS tests (Section 6)
- Manual testing with test users (customer, maker, admin, guest)
- Automated RLS test suite (Deno/pgTAP)

**Pass threshold:**
- 100% of RLS tests pass
- Zero unauthorized data access in manual tests
- All privilege escalation attempts fail

**Fail threshold:**
- Any RLS test failure
- Any successful unauthorized data access
- Any privilege escalation success

**Evidence artifact produced:**
- `supabase/tests/rls-verification.test.sql` (passing)
- `docs/phase1/rls-test-results-YYYY-MM-DD.md`
- Screenshots of failed access attempts (expected behavior)

**Status:** NOT VERIFIED — Gate blocks deployment until complete.

---

### Gate 6: Production Readiness

**What is being validated:**  
All production configuration complete. No dev/staging artifacts. Monitoring enabled.

**Exact metric / condition:**
- Environment variables documented in `.env.example`
- No hardcoded API keys or secrets in code
- Leaked password protection enabled in Supabase
- Rate limiting configured on Edge Functions
- Error logging functional (Supabase logs visible)

**Tool or method used:**
- Code grep for secrets (`grep -r "sk_live" .`)
- Supabase Dashboard settings review
- Manual test of rate limiting (exceed limit, verify 429)
- Log inspection (trigger error, verify logged)

**Pass threshold:**
- Zero secrets in code
- Leaked password protection = ON
- Rate limiting returns 429 when exceeded
- Errors logged to Supabase

**Fail threshold:**
- Any secret in code
- Leaked password protection = OFF
- Rate limiting not enforced
- Errors not logged

**Evidence artifact produced:**
- `docs/phase1/production-config-checklist-YYYY-MM-DD.md`
- Screenshot of Supabase security settings
- Rate limit test results (429 response)

**Status:** NOT VERIFIED — Gate blocks deployment until complete.

---

## 2️⃣ AUTOMATED TEST STRATEGY

### Unit Tests (Pricing & Rewards Logic)

**What is tested:**
- `calculateQuoteBreakdown()` function accuracy
- Minimum order enforcement ($18 CAD)
- Quantity discount calculation (10%, 15%, 20%)
- Rush surcharge calculation (15-25% on eligible items)
- Maker payout calculation
- `calculate_quality_points()` database function
- Fraud detection flag logic

**What is NOT tested:**
- UI rendering (covered by E2E)
- Database connection (covered by integration)
- File upload (not in Phase 1)

**Required tooling:**
- Vitest (frontend unit tests)
- Deno Test (Edge Function unit tests)
- pgTAP (database function tests)

**Where results are stored:**
- `test-results/unit-tests-YYYY-MM-DD.json`
- CI artifacts (if CI configured)
- Local: `coverage/` directory

**Gating protocol:**
- Run: `npm run test:unit` (frontend) + `deno test` (backend)
- Require: >80% code coverage for pricing logic
- Require: 100% of test cases passing
- Block deployment if any test fails

---

### Integration Tests (API Endpoints)

**What is tested:**
- `POST /functions/v1/calculate-quote` end-to-end
- Quote persistence in `quotes` table
- `GET /rest/v1/quotes` filtering and pagination
- `POST /rest/v1/print_requests` with quote_id
- Reorder functionality (reorder_of_request_id set)

**What is NOT tested:**
- Frontend UI (covered by E2E)
- RLS policies (covered by RLS tests)
- Performance under load (covered by performance tests)

**Required tooling:**
- Deno Test with Supabase client
- Postman/Newman for API testing
- Test database (staging or local Supabase)

**Where results are stored:**
- `test-results/integration-tests-YYYY-MM-DD.json`
- Postman test run results

**Gating protocol:**
- Run: `deno test supabase/functions/integration/`
- Require: 100% of integration tests passing
- Block deployment if any test fails

---

### RLS Tests (SQL-Level, Role-Based)

**What is tested:**
- Customer can view own quotes (positive test)
- Customer cannot view other customers' quotes (negative test)
- Admin can view all quotes (positive test)
- Guest cannot view authenticated quotes (negative test)
- Maker cannot modify customer profiles (negative test)
- Privilege escalation attempts (negative test)

**What is NOT tested:**
- Application-level authorization (covered by integration)
- UI permission checks (covered by E2E)

**Required tooling:**
- pgTAP (PostgreSQL testing framework)
- SQL scripts with test users
- Supabase SQL Editor for manual verification

**Where results are stored:**
- `supabase/tests/rls-verification.test.sql`
- `test-results/rls-tests-YYYY-MM-DD.md`

**Gating protocol:**
- Run: `supabase test db` (if configured) or manual SQL execution
- Require: 100% of RLS tests passing
- Block deployment if any unauthorized access succeeds

---

### E2E Tests (Quote Flow, Critical Paths)

**What is tested:**
- Complete quote flow: configure → calculate → save → order
- Multi-quote management: create multiple → view list → select → order
- Reorder flow: view past order → reorder → verify quote created
- Admin verification: view pending points → approve/reject

**What is NOT tested:**
- Every UI component (covered by component tests)
- Every API endpoint (covered by integration)
- Performance (covered by performance tests)

**Required tooling:**
- Playwright (preferred) or Cypress
- Test user accounts (customer, maker, admin)
- Test database with seed data

**Where results are stored:**
- `test-results/e2e-tests-YYYY-MM-DD/`
- Video recordings of test runs
- Screenshots of failures

**Gating protocol:**
- Run: `npm run test:e2e`
- Require: 100% of critical path tests passing
- Block deployment if any E2E test fails

---

### CI Integration (If Exists)

**Current CI status:** NOT CONFIGURED

**If CI exists:**
- Integrate all test suites into CI pipeline
- Run on every PR to `main`
- Block merge if tests fail

**If CI does not exist:**
- **Local gating protocol:**
  1. Developer runs all tests locally before PR
  2. Reviewer verifies test results in PR description
  3. Agent C runs full test suite before production deployment
  4. Deployment blocked if any test fails

---

## 3️⃣ PERFORMANCE VERIFICATION PLAN

### Quote Flow Timing (p50 / p95)

**Measurement points:**
1. User clicks "Calculate Quote" → Quote displayed (frontend + backend)
2. User clicks "View My Quotes" → List rendered (database query)
3. User clicks quote → Quote details displayed (retrieval)

**Measurement method:**
- Chrome DevTools Performance tab
- `performance.mark()` and `performance.measure()` in code
- Supabase Dashboard query performance metrics

**Thresholds:**
- **p50 (median):**
  - Quote calculation: < 1.5s
  - Quote retrieval: < 300ms
  - Quote list: < 150ms
- **p95 (95th percentile):**
  - Quote calculation: < 3s
  - Quote retrieval: < 500ms
  - Quote list: < 200ms

**Evidence capture:**
- Export Performance trace as JSON
- Screenshot of timing summary
- Supabase query performance screenshot

**Failure condition:**
- p95 exceeds thresholds = HARD STOP

---

### API Latency

**Endpoints to measure:**
- `POST /functions/v1/calculate-quote`
- `GET /rest/v1/quotes`
- `POST /rest/v1/print_requests`

**Measurement method:**
- Postman/Newman with response time assertions
- `curl` with `-w "%{time_total}"` flag
- Supabase Edge Function logs (execution time)

**Thresholds:**
- **p50:** < 200ms
- **p95:** < 500ms
- **Cold start:** < 2s (Edge Functions)

**Evidence capture:**
- Postman test results with timing
- Edge Function logs screenshot
- CSV of 100 request timings

**Failure condition:**
- p95 > 1s = HARD STOP

---

### Database Query Latency

**Queries to measure:**
- `SELECT * FROM quotes WHERE user_id = ? AND status = 'active'`
- `INSERT INTO quotes (...) VALUES (...)`
- `SELECT * FROM print_requests WHERE quote_id = ?`

**Measurement method:**
- Supabase Dashboard query performance
- `EXPLAIN ANALYZE` in SQL Editor
- pgBench for load testing (optional)

**Thresholds:**
- **Simple SELECT:** < 50ms
- **INSERT:** < 100ms
- **JOIN queries:** < 200ms

**Evidence capture:**
- `EXPLAIN ANALYZE` output
- Supabase Dashboard screenshots
- Query execution plan

**Failure condition:**
- Any query > 500ms = HARD STOP

---

### Page Load Performance

**Pages to measure:**
- Landing page (/)
- Quote calculator (/quote)
- Dashboard (/dashboard)
- Admin panel (/admin)

**Measurement method:**
- Lighthouse CI (automated)
- Manual Lighthouse run in Chrome DevTools
- WebPageTest (optional)

**Lighthouse protocol:**
- **Device:** Mobile (emulated Moto G4)
- **Network:** Fast 3G throttling
- **CPU:** 4x slowdown
- **Runs:** 3 runs, median score

**Core Web Vitals thresholds:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Lighthouse score thresholds:**
- **Performance:** ≥ 90
- **Accessibility:** ≥ 90
- **Best Practices:** ≥ 90
- **SEO:** ≥ 90

**Throttling profiles:**
- **Fast 3G:** 1.6 Mbps down, 750 Kbps up, 150ms RTT
- **Slow 3G:** 400 Kbps down, 400 Kbps up, 400ms RTT (optional)
- **4G:** 4 Mbps down, 3 Mbps up, 20ms RTT (baseline)

**Evidence capture:**
- Lighthouse JSON report (`lighthouse-YYYY-MM-DD.json`)
- Lighthouse HTML report
- Screenshots of Core Web Vitals

**Failure condition:**
- Performance score < 80 = HARD STOP
- Any Core Web Vital in "Poor" range = HARD STOP

---

## 4️⃣ ACCESSIBILITY COMPLIANCE PLAN (BLOCKER)

### Automated Checks (axe-core)

**Tool:** axe DevTools or @axe-core/cli

**Pages to scan:**
- Landing page (/)
- Quote calculator (/quote)
- Dashboard (/dashboard)
- Admin panel (/admin)

**Command:**
```bash
npx @axe-core/cli https://localhost:3000/quote --save axe-results.json
```

**Pass threshold:**
- Zero critical violations
- Zero serious violations
- < 5 moderate violations (documented and triaged)

**Fail threshold:**
- Any critical violation
- > 2 serious violations

**Evidence:** `docs/phase1/axe-results-YYYY-MM-DD.json`

---

### Manual Checks

#### Keyboard Navigation

**Test procedure:**
1. Disconnect mouse
2. Navigate quote flow using only Tab, Shift+Tab, Enter, Space, Esc
3. Verify all interactive elements reachable
4. Verify no keyboard traps
5. Verify logical tab order

**Pass criteria:**
- All buttons, links, form fields reachable
- Tab order follows visual order
- Focus visible at all times
- No keyboard traps

**Fail criteria:**
- Any interactive element unreachable
- Tab order illogical
- Focus invisible

**Evidence:** Video recording of keyboard navigation

---

#### Focus Visibility

**Test procedure:**
1. Tab through all interactive elements
2. Verify focus indicator visible and distinct
3. Check focus indicator meets 3:1 contrast ratio

**Pass criteria:**
- Focus indicator visible on all elements
- Contrast ratio ≥ 3:1

**Fail criteria:**
- Focus indicator invisible or low contrast

**Evidence:** Screenshots of focus states

---

#### Screen Reader Sanity Pass

**Tool:** NVDA (Windows) or VoiceOver (Mac)

**Test procedure:**
1. Enable screen reader
2. Navigate quote flow
3. Verify all content announced
4. Verify form labels announced
5. Verify button purposes clear

**Pass criteria:**
- All text content announced
- All form fields have labels
- All buttons have accessible names
- No "button button" or "link link" announcements

**Fail criteria:**
- Any unlabeled form field
- Any button without accessible name
- Any critical content not announced

**Evidence:** Audio recording or transcript of screen reader output

---

#### Color Contrast Verification

**Tool:** Chrome DevTools Contrast Checker or WebAIM Contrast Checker

**Test procedure:**
1. Check all text against background
2. Verify normal text ≥ 4.5:1
3. Verify large text ≥ 3:1
4. Verify UI components ≥ 3:1

**Pass criteria:**
- All text meets WCAG AA contrast ratios
- All interactive components meet 3:1

**Fail criteria:**
- Any text below 4.5:1 (normal) or 3:1 (large)
- Any interactive component below 3:1

**Evidence:** `docs/phase1/contrast-audit-YYYY-MM-DD.md` with screenshots

---

#### Reduced-Motion Verification

**Test procedure:**
1. Enable "Reduce motion" in OS settings
2. Navigate site
3. Verify animations disabled or reduced
4. Verify no essential motion (motion required to understand content)

**Pass criteria:**
- `prefers-reduced-motion: reduce` media query implemented
- Animations disabled or reduced when preference set
- No essential motion

**Fail criteria:**
- Animations still play when reduced motion enabled
- Essential motion not replaced with static alternative

**Evidence:** Video comparison (motion on vs. motion off)

---

### What Constitutes a Violation

**Critical (blocks release):**
- Missing form labels
- Keyboard trap
- Insufficient color contrast (< 3:1)
- Missing alt text on informative images
- Inaccessible interactive elements

**Serious (blocks release unless documented exception):**
- Illogical tab order
- Missing focus indicators
- Unclear button labels
- Missing ARIA labels where needed

**Moderate (can be deferred if documented):**
- Redundant ARIA
- Minor semantic HTML issues
- Non-critical contrast issues (decorative elements)

---

### What Blocks Release

**Absolute blockers:**
- Any critical violation
- > 2 serious violations
- Keyboard navigation failure on critical path
- Screen reader cannot complete quote flow

**Can be deferred (with documentation):**
- Moderate violations (< 5)
- Minor semantic HTML issues
- Non-critical pages (e.g., about page)

---

### What Can Be Deferred (If Any)

**Allowed deferrals (must be documented in GitHub issues):**
- Accessibility improvements for non-critical pages
- Advanced ARIA patterns (if basic accessibility met)
- Accessibility for admin-only features (if admin users trained)

**NOT allowed to defer:**
- Keyboard navigation for quote flow
- Screen reader support for quote flow
- Color contrast for any user-facing content
- Form labels

---

## 5️⃣ SECURITY AUDIT PLAN (OWASP-FOCUSED)

### Broken Access Control (RLS)

**Attack scenario:**
- Customer attempts to view another customer's quotes by manipulating `user_id` parameter
- Customer attempts to access admin-only endpoints
- Guest attempts to access authenticated-only data

**Detection method:**
- Manual testing with test users
- Automated RLS tests (Section 6)
- SQL injection attempts in query parameters

**Expected failure behavior:**
- 403 Forbidden or empty result set
- RLS policy blocks unauthorized access
- Error logged to Supabase

**Evidence of protection:**
- RLS test results (all negative tests fail as expected)
- Screenshots of 403 responses
- Supabase logs showing blocked access

**Status:** NOT VERIFIED — Blocks deployment.

---

### Injection

**Attack scenario:**
- SQL injection via quote parameters (material, quantity, etc.)
- NoSQL injection via JSONB fields (price_breakdown, fraud_flags)
- Command injection via file names

**Detection method:**
- Manual injection attempts with payloads:
  - `'; DROP TABLE quotes; --`
  - `{"$ne": null}`
  - `$(whoami)`
- Automated security scanning (OWASP ZAP or similar)

**Expected failure behavior:**
- Parameterized queries prevent SQL injection
- Input validation rejects malicious payloads
- Error returned, no code execution

**Evidence of protection:**
- Test results showing injection attempts blocked
- Code review confirming parameterized queries
- Input validation tests passing

**Status:** NOT VERIFIED — Blocks deployment.

---

### Auth Misconfiguration

**Attack scenario:**
- JWT token manipulation (change user_id, role)
- Session hijacking (steal session token)
- Weak password acceptance (despite leaked password protection)

**Detection method:**
- Attempt to modify JWT payload and use modified token
- Test session token reuse after logout
- Attempt signup with known leaked password (e.g., "password123")

**Expected failure behavior:**
- Modified JWT rejected (signature validation)
- Session token invalidated after logout
- Leaked password rejected during signup

**Evidence of protection:**
- JWT validation test results
- Session invalidation test results
- Screenshot of leaked password protection enabled

**Status:** NOT VERIFIED — Blocks deployment.

---

### File Upload Abuse

**Attack scenario:**
- Upload malicious file (e.g., executable disguised as STL)
- Upload oversized file (DoS via storage exhaustion)
- Upload file with malicious filename (path traversal)

**Detection method:**
- Attempt to upload `.exe` file renamed to `.stl`
- Attempt to upload 1GB file
- Attempt to upload file named `../../etc/passwd.stl`

**Expected failure behavior:**
- File type validation rejects non-STL/3MF files
- File size limit enforced (reject > 50MB)
- Filename sanitized (path traversal prevented)

**Evidence of protection:**
- File upload validation tests
- File size limit configuration
- Filename sanitization code review

**Status:** NOT APPLICABLE — File upload not in Phase 1. Defer to Phase 2.

---

### Rate Limiting

**Attack scenario:**
- Brute force quote calculation (100+ requests/minute)
- DoS via excessive API calls
- Credential stuffing on login endpoint

**Detection method:**
- Automated script to send 200 requests to `calculate-quote` endpoint
- Verify 429 Too Many Requests returned after limit exceeded
- Verify rate limit resets after window expires

**Expected failure behavior:**
- Rate limit enforced (100 requests/minute per IP)
- 429 response returned with `Retry-After` header
- Legitimate requests resume after window

**Evidence of protection:**
- Rate limit test results (429 after 100 requests)
- Edge Function rate limit configuration
- `Retry-After` header verification

**Status:** NOT VERIFIED — Blocks deployment.

---

### Logging Gaps

**Attack scenario:**
- Failed login attempts not logged (attacker can brute force undetected)
- RLS violations not logged (attacker can probe without detection)
- API errors not logged (bugs go unnoticed)

**Detection method:**
- Trigger failed login → check Supabase logs
- Trigger RLS violation → check Supabase logs
- Trigger API error (500) → check Supabase logs

**Expected failure behavior:**
- All security events logged with timestamp, user_id, IP
- Logs retained for ≥ 30 days
- Logs accessible to admins only

**Evidence of protection:**
- Screenshots of Supabase logs showing security events
- Log retention policy documentation
- Log access control verification

**Status:** NOT VERIFIED — Blocks deployment.

---

## 6️⃣ RLS VERIFICATION STRATEGY (CRITICAL)

### Table Inventory Under Phase 1

**Tables with RLS policies:**
1. `profiles`
2. `subscriptions`
3. `credit_wallets`
4. `point_wallets`
5. `point_transactions`
6. `quotes` (NEW in Phase 1)
7. `print_requests`
8. `creator_models`
9. `user_roles`
10. `referrals`
11. `user_referral_codes`
12. `achievements`
13. `user_achievements`

**Tables NOT in Phase 1 scope:**
- `gift_cards`, `coupons`, `recycling_drops`, `social_shares`, etc. (defer to Phase 2)

---

### Required RLS Tests Per Role

#### Guest (Unauthenticated)

**Positive tests (should succeed):**
- View public achievements list
- View active coupons (if implemented)

**Negative tests (should fail):**
- View any user's profile
- View any user's quotes
- View any user's wallet balances
- Create quote without session_id
- Access admin panel

**Escalation tests:**
- Attempt to set `user_id` in quote creation (should be ignored, use session_id)
- Attempt to access `/admin` routes (should redirect to login)

---

#### Customer (Authenticated, role='customer')

**Positive tests (should succeed):**
- View own profile
- Update own profile
- View own quotes
- Create new quote
- View own credit/point wallets
- View own transactions
- Create print request from own quote

**Negative tests (should fail):**
- View another customer's profile
- View another customer's quotes
- View another customer's wallets
- Update another customer's profile
- Access maker-only endpoints
- Access admin-only endpoints

**Escalation tests:**
- Attempt to modify `user_id` in UPDATE query (should fail)
- Attempt to INSERT into `user_roles` with role='admin' (should fail)
- Attempt to view all quotes via `SELECT * FROM quotes` (should only see own)

---

#### Maker (Authenticated, role='maker')

**Positive tests (should succeed):**
- All customer permissions (maker inherits customer)
- View unassigned print requests
- Claim print request (set maker_id to self)
- View own print jobs
- Update own print job status

**Negative tests (should fail):**
- View another maker's print jobs
- Claim already-assigned print request
- Modify customer's print request details
- Access admin-only endpoints

**Escalation tests:**
- Attempt to claim print request by setting maker_id to another maker (should fail)
- Attempt to modify print request pricing (should fail)

---

#### Admin (Authenticated, role='admin')

**Positive tests (should succeed):**
- View all profiles
- View all quotes
- View all wallets
- View all transactions
- Update verification status on point_transactions
- View all print requests
- Assign print requests to makers

**Negative tests (should fail):**
- None (admin has full access)

**Escalation tests:**
- Verify admin cannot be demoted by self (UPDATE user_roles should fail if not SECURITY DEFINER)
- Verify admin actions are logged

---

### Test Implementation

**SQL test template:**
```sql
-- Test: Customer cannot view other customer's quotes
BEGIN;
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claims TO '{"sub": "customer-1-uuid"}';
  
  -- Should return only customer-1's quotes
  SELECT COUNT(*) FROM quotes WHERE user_id != 'customer-1-uuid';
  -- Expected: 0 rows (RLS blocks)
  
ROLLBACK;
```

**Automated test suite location:**
- `supabase/tests/rls-verification.test.sql`

**Manual test procedure:**
1. Create test users (customer-1, customer-2, maker-1, admin-1)
2. Seed test data (quotes, profiles, wallets)
3. Run SQL tests for each role
4. Verify expected results

**Evidence artifacts:**
- `docs/phase1/rls-test-results-YYYY-MM-DD.md`
- SQL test output (pass/fail for each test)
- Screenshots of failed access attempts

---

### RLS Failure = Absolute Release Block

**No exceptions. No deferrals.**

If any RLS test fails:
1. Deployment BLOCKED
2. Root cause analysis required
3. Fix implemented and verified
4. All RLS tests re-run
5. Only after 100% pass rate: deployment allowed

---

## 7️⃣ "TRUTHFUL UI" AUDIT CHECKLIST

### Every Button Does Something Real

**Audit procedure:**
1. Inventory all buttons in Phase 1 UI
2. For each button, verify:
   - Click triggers backend action OR
   - Click triggers local state change OR
   - Button is disabled with tooltip explaining why

**Checklist:**
- [ ] "Calculate Quote" button → calls `calculate-quote` Edge Function
- [ ] "Save Quote" button → saves quote to database
- [ ] "Order Now" button → creates print_request with quote_id
- [ ] "Reorder" button → creates new quote from previous request
- [ ] "Approve Points" button (admin) → updates verification_status
- [ ] "Reject Points" button (admin) → updates verification_status with notes

**Fail condition:**
- Any button that does nothing when clicked (no loading state, no error, no success)

---

### Disabled Actions Explain Why

**Audit procedure:**
1. Identify all disabled buttons/actions
2. Verify each has tooltip or inline text explaining why disabled

**Checklist:**
- [ ] "Order Now" disabled if no quote selected → tooltip: "Select a quote first"
- [ ] "Reorder" disabled if quote expired → tooltip: "Quote expired, create new quote"
- [ ] "Approve Points" disabled if already verified → tooltip: "Already verified"
- [ ] "Calculate Quote" disabled if form invalid → inline error messages visible

**Fail condition:**
- Any disabled element without explanation

---

### No Optimistic Success Without Backend Confirmation

**Audit procedure:**
1. Review all success messages in UI
2. Verify success only shown AFTER backend confirms

**Checklist:**
- [ ] "Quote saved!" only shown after database INSERT succeeds
- [ ] "Order created!" only shown after print_request INSERT succeeds
- [ ] "Points approved!" only shown after UPDATE succeeds
- [ ] Loading states shown during backend calls

**Fail condition:**
- Any success message shown before backend confirmation
- Any optimistic UI update that isn't rolled back on error

---

### Error States Are Visible and Actionable

**Audit procedure:**
1. Trigger all error scenarios
2. Verify error message displayed
3. Verify error message explains what went wrong and what to do

**Checklist:**
- [ ] API error (500) → "Something went wrong. Please try again."
- [ ] Rate limit (429) → "Too many requests. Please wait 60 seconds."
- [ ] Validation error (400) → Specific field errors shown inline
- [ ] Network error → "Connection lost. Check your internet."
- [ ] Quote expired → "This quote has expired. Create a new quote."

**Fail condition:**
- Any error swallowed silently (no message to user)
- Any error message that doesn't explain what to do next

---

### Evidence Artifact

**Document:** `docs/phase1/truthful-ui-audit-YYYY-MM-DD.md`

**Contents:**
- Checklist of all interactive elements
- Screenshots of disabled states with tooltips
- Screenshots of error states
- Video of button click → backend action flow

---

## 8️⃣ RELEASE READINESS CHECKLIST (GO / NO-GO)

### Required Artifacts

- [ ] `docs/phase1/truthful-ui-audit-YYYY-MM-DD.md`
- [ ] `docs/phase1/api-contract-verification-YYYY-MM-DD.md`
- [ ] `docs/phase1/component-inventory-YYYY-MM-DD.md`
- [ ] `docs/phase1/performance-report-YYYY-MM-DD.json` (Lighthouse)
- [ ] `docs/phase1/rls-test-results-YYYY-MM-DD.md`
- [ ] `docs/phase1/axe-results-YYYY-MM-DD.json`
- [ ] `docs/phase1/contrast-audit-YYYY-MM-DD.md`
- [ ] `docs/phase1/production-config-checklist-YYYY-MM-DD.md`
- [ ] `test-results/unit-tests-YYYY-MM-DD.json`
- [ ] `test-results/integration-tests-YYYY-MM-DD.json`
- [ ] `test-results/e2e-tests-YYYY-MM-DD/`
- [ ] `supabase/tests/rls-verification.test.sql` (passing)

---

### Required Metrics

**Performance:**
- [ ] Lighthouse Performance score ≥ 90
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Quote calculation p95 < 3s
- [ ] API latency p95 < 500ms

**Accessibility:**
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Zero critical axe violations
- [ ] Zero serious axe violations
- [ ] Keyboard navigation functional
- [ ] Screen reader sanity pass complete

**Security:**
- [ ] 100% RLS tests passing
- [ ] Rate limiting enforced
- [ ] Leaked password protection enabled
- [ ] Zero secrets in code
- [ ] All security events logged

**Functionality:**
- [ ] 100% unit tests passing
- [ ] 100% integration tests passing
- [ ] 100% E2E tests passing
- [ ] Quote calculation matches frontend pricing (100% accuracy)
- [ ] API contracts verified

---

### Required Sign-Offs

- [ ] **Agent A (UI):** "UI is truthful, accessible, and matches design"
- [ ] **Agent B (Backend):** "API contracts stable, RLS verified, migrations tested"
- [ ] **Agent C (QA):** "All gates passed, no critical failures, approved for deployment"
- [ ] **Program Director:** "Phase 1 scope complete, ready for production"

---

### Conditions That Force Delay

**Automatic delay (no discussion):**
- Any RLS test failure
- Lighthouse Performance < 80
- Any critical accessibility violation
- Any E2E test failure on critical path
- Any security vulnerability (injection, auth bypass, etc.)
- API contract drift (frontend/backend mismatch)

**Delay pending review:**
- Lighthouse Performance 80-89 (requires optimization plan)
- > 2 serious accessibility violations (requires remediation plan)
- Unit test coverage < 80% (requires additional tests)

---

## 9️⃣ DEFINITION OF DONE (AGENT C SIGN-OFF)

### What Must Be True for Agent C to Approve Release

**Non-negotiable requirements:**

1. **All 6 quality gates PASSED** (Section 1)
2. **All automated tests PASSING** (Section 2)
3. **Performance thresholds MET** (Section 3)
4. **Accessibility compliance VERIFIED** (Section 4)
5. **Security audit COMPLETE** (Section 5)
6. **RLS verification 100% PASSING** (Section 6)
7. **Truthful UI audit COMPLETE** (Section 7)
8. **Release readiness checklist 100% COMPLETE** (Section 8)

---

### What Evidence Must Exist

**Required documentation:**
- All artifacts listed in Section 8 (12 documents minimum)
- Video recordings of keyboard navigation and E2E tests
- Screenshots of all disabled states, error states, and focus states
- Lighthouse reports for all critical pages
- RLS test results with 100% pass rate
- API contract test results with 100% pass rate

**Required test results:**
- Unit tests: >80% coverage, 100% passing
- Integration tests: 100% passing
- E2E tests: 100% passing (critical paths)
- RLS tests: 100% passing
- Performance tests: All thresholds met
- Accessibility tests: Zero critical/serious violations

---

### What Blocks Approval Immediately

**Absolute blockers (no exceptions):**
- Any RLS test failure
- Any security vulnerability
- Any critical accessibility violation
- Any E2E test failure on critical path (quote flow)
- Lighthouse Performance < 80
- API contract mismatch
- Any "silent no-op" button in production
- Any optimistic UI without backend confirmation
- Any error swallowed silently
- Leaked password protection disabled
- Secrets in code
- Rate limiting not enforced

**Blockers pending remediation:**
- Lighthouse Performance 80-89 (requires optimization plan + timeline)
- > 2 serious accessibility violations (requires remediation plan + timeline)
- Unit test coverage < 80% (requires additional tests)

---

## FINAL AUTHORITY STATEMENT

**Agent C has final veto power on production deployment.**

If any gate fails, any test fails, any metric misses threshold, or any evidence is missing:

**DEPLOYMENT IS BLOCKED. NO EXCEPTIONS.**

The Program Director may override Agent C only if:
1. A written exception is documented
2. A remediation plan with timeline is provided
3. The risk is explicitly accepted in writing

Otherwise, Agent C's decision is final.

---

**Document Status:** DRAFT — All gates NOT VERIFIED  
**Deployment Status:** BLOCKED pending verification  
**Next Action:** Execute verification plan, collect evidence, update gate status

---

*Agent C — QA, Security & Performance Gatekeeper*  
*January 7, 2026*
