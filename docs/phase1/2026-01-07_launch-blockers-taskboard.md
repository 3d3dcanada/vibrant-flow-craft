---
project: 3d3d.ca
phase: Phase 1 Vertical Slice
date: 2026-01-07
owner: Agent E
artifact: Launch Blockers Taskboard
---

# Launch Blockers Taskboard

## Critical Path to Soft Launch

```
B-DEPLOY → B-STORAGE → A-QUOTE-UI → C-E2E → C-RLS → E-VERIFY → SOFT LAUNCH
```

---

## P0 Blockers (Must Fix Before Any Launch)

| ID | Blocker | Owner | Files to Change | Tests to Run | Dependency | Accept Criteria |
|----|---------|-------|-----------------|--------------|------------|-----------------|
| B-DEPLOY | Deploy Phase 1 migrations | B | None (apply existing) | `SELECT * FROM quotes LIMIT 1` | None | Query returns empty result (table exists) |
| B-FUNC | Deploy calculate-quote edge function | B | None (deploy existing) | `curl POST /functions/v1/calculate-quote` | B-DEPLOY | Returns 200 with quote_id |
| B-STORAGE | Create stl-uploads storage bucket | B | Supabase Dashboard | Upload test file via client | B-DEPLOY | Upload succeeds, file accessible |
| A-QUOTE | Build quote configurator UI (Steps 1-5) | A | `src/pages/Quote*.tsx` | Manual flow test | B-FUNC, B-STORAGE | Guest can complete quote E2E |
| C-RLS | Verify RLS policies in runtime | C | None (test existing) | RLS test suite SQL | B-DEPLOY | 0 violations across all tables |
| C-E2E | Integration tests for quote flow | C | `tests/e2e/quote.spec.ts` | Playwright/Cypress run | A-QUOTE | All critical paths pass |

---

## P1 Blockers (Must Fix Before Public Launch)

| ID | Blocker | Owner | Files to Change | Tests to Run | Dependency | Accept Criteria |
|----|---------|-------|-----------------|--------------|------------|-----------------|
| A-DISCLOSURE | Add "no payments yet" disclosure | A | `src/pages/Index.tsx`, `src/pages/Quote*.tsx` | Visual audit | None | Disclosure visible on landing + quote confirmation |
| A-CASL | Add CASL consent checkbox to signup | A | `src/pages/Auth.tsx`, `src/components/auth/*` | Signup flow test | None | Checkbox required, timestamp logged |
| B-CASL | Log CASL consent timestamp | B | `supabase/migrations/xxx_casl_consent.sql`, trigger | `SELECT consent_timestamp FROM profiles` | A-CASL | Timestamp recorded on signup |
| D-SEO | Add SEO metadata to all pages | D | `src/pages/*.tsx` | Lighthouse SEO audit | None | SEO score ≥90 |
| D-COPY | Finalize landing page copy | D | `src/pages/Index.tsx` | Content review | None | No placeholder text |
| C-A11Y | Accessibility audit | C | Various components | axe-core + manual | A-QUOTE | 0 critical violations |
| C-PERF | Performance audit | C | Various | Lighthouse CI | A-QUOTE | Performance ≥85 all pages |

---

## P2 Blockers (Should Fix Before Public Launch)

| ID | Blocker | Owner | Files to Change | Tests to Run | Dependency | Accept Criteria |
|----|---------|-------|-----------------|--------------|------------|-----------------|
| A-TOAST | Remove framer-motion from ToS page | A | `src/pages/TermsOfService.tsx` | Build passes | None | No framer-motion imports |
| B-ANALYZE | Implement analyze-stl edge function | B | `supabase/functions/analyze-stl/*` | Unit tests | None | Extracts volume/weight from STL |
| B-ACHIEVE | Implement achievement triggers | B | `supabase/migrations/*_achievements.sql` | Trigger tests | B-DEPLOY | Points awarded on first order |
| A-FAQ | Create FAQ page | A | `src/pages/FAQ.tsx`, `App.tsx` | Manual review | D-COPY | ≥5 FAQs answered |
| E-RUNBOOK | Document deployment runbook | E | `docs/phase1/deployment-runbook.md` | Dry run | All P0/P1 | Complete runbook for staging → prod |

---

## Deployment Sequence

### Phase 1: Backend Foundation (Agent B)

```bash
# 1. Apply migrations to staging
supabase db push --db-url $STAGING_DB_URL

# 2. Verify tables exist
supabase db dump --schema public --data-only=false | grep "CREATE TABLE.*quotes"

# 3. Deploy edge function
supabase functions deploy calculate-quote

# 4. Test edge function
curl -X POST https://$PROJECT_ID.supabase.co/functions/v1/calculate-quote \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"grams": 100, "material": "PLA_STANDARD", "quality": "standard", "quantity": 1, "delivery_speed": "standard"}'

# 5. Create storage bucket (via Dashboard or CLI)
# Dashboard: Storage → New Bucket → "stl-uploads"
# - Public: No
# - Size limit: 50MB
# - Add RLS policies
```

### Phase 2: Frontend Integration (Agent A)

| Step | Files | Accept Criteria |
|------|-------|-----------------|
| 1. Quote Step 1 (Upload) | `src/pages/QuoteUpload.tsx` | File upload to stl-uploads succeeds |
| 2. Quote Step 2 (Material) | `src/pages/QuoteMaterial.tsx` | Material selection updates price |
| 3. Quote Step 3 (Quantity) | `src/pages/QuoteQuantity.tsx` | Quantity discounts display |
| 4. Quote Step 4 (Breakdown) | `src/pages/QuoteBreakdown.tsx` | All line items visible |
| 5. Quote Step 5 (Checkout) | `src/pages/QuoteCheckout.tsx` | Guest can submit with email |
| 6. Disclosure | `src/pages/Index.tsx` | "No payments" banner visible |
| 7. CASL Consent | `src/pages/Auth.tsx` | Opt-in checkbox on signup |

### Phase 3: QA Verification (Agent C)

| Step | Command | Accept Criteria |
|------|---------|-----------------|
| 1. RLS Tests | `psql -f tests/rls_security.sql` | 0 violations |
| 2. E2E Tests | `pnpm test:e2e` | All paths pass |
| 3. Accessibility | `pnpm test:a11y` | 0 critical violations |
| 4. Performance | `pnpm test:lighthouse` | ≥85 all pages |
| 5. Cross-browser | Manual matrix | Chrome, Firefox, Safari, Edge pass |

### Phase 4: Go-Live (Agent E)

| Step | Owner | Accept Criteria |
|------|-------|-----------------|
| 1. Staging verification | E | All E2E tests pass on staging |
| 2. Legal review | E | Privacy, Terms, Disclosure present |
| 3. Maker network check | E | ≥3 verified makers in DB |
| 4. Production migration | B | Migrations applied to prod |
| 5. Function deploy | B | calculate-quote live on prod |
| 6. Smoke test | C | Guest quote flow works on prod |
| 7. Soft launch | E | Invite-only access enabled |

---

## Owner Assignments

| Agent | Responsibilities | Tickets |
|-------|------------------|---------|
| **A** | Quote UI, disclosures, CASL UI, FAQ, framer-motion removal | A-QUOTE, A-DISCLOSURE, A-CASL, A-FAQ, A-TOAST |
| **B** | Migrations, edge functions, storage, CASL logging, analyze-stl | B-DEPLOY, B-FUNC, B-STORAGE, B-CASL, B-ANALYZE, B-ACHIEVE |
| **C** | RLS tests, E2E tests, accessibility, performance, cross-browser | C-RLS, C-E2E, C-A11Y, C-PERF |
| **D** | SEO metadata, landing copy | D-SEO, D-COPY |
| **E** | Integration verification, runbook, go-live coordination | E-RUNBOOK, final sign-off |

---

## Timeline Estimate

| Phase | Duration | Dependency |
|-------|----------|------------|
| Backend deployment (B-DEPLOY, B-FUNC, B-STORAGE) | 1 day | None |
| Quote UI (A-QUOTE) | 3-5 days | Backend deployed |
| Legal add-ons (A-DISCLOSURE, A-CASL, B-CASL) | 1 day | None |
| QA pass (C-RLS, C-E2E, C-A11Y, C-PERF) | 2-3 days | Quote UI complete |
| Soft launch prep (E-RUNBOOK, verification) | 1 day | QA pass |

**Optimistic path to Soft Launch: 7-10 days**

---

*Taskboard generated 2026-01-07T15:47 by Agent E*
