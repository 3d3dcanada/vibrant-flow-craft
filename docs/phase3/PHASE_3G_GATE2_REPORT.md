# Phase 3G Gate 2 Report (Preview Runner + Audit Hardening)

**Scope:** Make preview seed runnable via one command and make audit checks reliable and non-mutating.  
**Status:** ✅ COMPLETE (code changes applied).

---

## Phase 3G Gate 3 Status (Runtime Verification)

**Status:** ⚠️ OPERATOR-EXECUTED  
**Reason:** Secrets not available in CI/review context.  
**Required operator inputs:** `PREVIEW_MODE=true`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SEED_CUSTOMER_EMAIL`, `SEED_MAKER_EMAIL`, `SEED_ADMIN_EMAIL`, `SEED_DEFAULT_PASSWORD`  
**Command (copy/paste):**

```bash
PREVIEW_MODE=true \
SUPABASE_URL=https://<project>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service_role_key> \
SEED_CUSTOMER_EMAIL=you@example.com \
SEED_MAKER_EMAIL=maker-preview@example.com \
SEED_ADMIN_EMAIL=admin-preview@example.com \
SEED_DEFAULT_PASSWORD='PreviewPass!234' \
pnpm seed:preview
```

**Expected PASS conditions:** Seed script completes without errors; Fulfillment Audit checks pass; click-path confirms seeded orders in admin, maker, and customer views.
**Screenshots optional; browser automation may fail in container environments.**

---

## Phase 3G Gate 3 — Runtime Verification (Operator-Executed)

**Required environment variables**
- `PREVIEW_MODE=true`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SEED_CUSTOMER_EMAIL`
- `SEED_MAKER_EMAIL`
- `SEED_ADMIN_EMAIL`
- `SEED_DEFAULT_PASSWORD`

**One-command seed invocation**

```bash
PREVIEW_MODE=true \
SUPABASE_URL=https://<project>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service_role_key> \
SEED_CUSTOMER_EMAIL=you@example.com \
SEED_MAKER_EMAIL=maker-preview@example.com \
SEED_ADMIN_EMAIL=admin-preview@example.com \
SEED_DEFAULT_PASSWORD='PreviewPass!234' \
pnpm seed:preview
```

**60-second click-path**
1. Admin Dashboard → Launch Preview → Fulfillment Audit → Re-run Checks.
2. Admin Dashboard → Payments & Orders (verify seeded orders).
3. Maker Dashboard → Jobs/Earnings (verify seeded assignments).
4. Customer Dashboard → My Orders → open shipped order (timeline + tracking).

**PASS criteria**
- Preview seed completes without errors and outputs created/existing users and orders.
- Fulfillment Audit checks pass with no failures.
- Admin/Maker/Customer views show the expected seeded orders and statuses.

**FAIL criteria**
- Seed script exits with error or missing env vars.
- Fulfillment Audit shows failures caused by missing data or guardrail regressions.
- Click-path cannot find seeded orders or shows missing tracking/timeline data.

**Mandatory before launch:** Gate 3 must be executed by an operator with secrets before production release.

---

## What Changed

- Added `pnpm seed:preview` + `pnpm seed:preview:help` scripts for a single-command preview seed run.
- Hardened Fulfillment Audit to use admin RPCs for guardrail checks and a non-mutating delivered guard simulation.
- Seed script now prints created/existing users, order IDs/statuses, and immediate click-path guidance.

---

## Run Preview Seed (One Command)

```bash
PREVIEW_MODE=true \
SUPABASE_URL=https://<project>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service_role_key> \
SEED_CUSTOMER_EMAIL=you@example.com \
SEED_MAKER_EMAIL=maker-preview@example.com \
SEED_ADMIN_EMAIL=admin-preview@example.com \
SEED_DEFAULT_PASSWORD='PreviewPass!234' \
pnpm seed:preview
```

Need help? Run:

```bash
pnpm seed:preview:help
```

---

## 60-Second Demo Click-Path

1. **Admin Dashboard → Launch Preview → Fulfillment Audit → Re-run Checks**
2. **Admin Dashboard → Payments & Orders** to view seeded orders.
3. **Maker Dashboard → Jobs/Earnings** to see seeded assignments and payouts.
4. **Customer Dashboard → My Orders** and open the shipped order to see timeline + tracking.
