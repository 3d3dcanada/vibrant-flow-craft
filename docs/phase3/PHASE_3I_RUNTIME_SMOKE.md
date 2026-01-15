# Phase 3I Runtime Smoke

## Prerequisites
- `pnpm install` completed locally.
- Preview seed requirements:
  - `PREVIEW_MODE=true`
  - `SUPABASE_URL=https://<project>.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY=<service_role_key>`
  - `SEED_CUSTOMER_EMAIL=you@example.com`
  - Optional: `SEED_MAKER_EMAIL=maker-preview@example.com`, `SEED_ADMIN_EMAIL=admin-preview@example.com`, `SEED_DEFAULT_PASSWORD=PreviewPass!234`
- **Do not run with `SUPABASE_SERVICE_ROLE_KEY` in production.**

## Exact Command
```bash
PREVIEW_MODE=true SUPABASE_URL=https://<project>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<service_role_key> \
SEED_CUSTOMER_EMAIL=you@example.com SEED_MAKER_EMAIL=maker-preview@example.com \
SEED_ADMIN_EMAIL=admin-preview@example.com SEED_DEFAULT_PASSWORD=PreviewPass!234 pnpm seed:preview
```

## Click-Path (Runtime Smoke Walkthrough)
1. Sign in as the seeded admin (`SEED_ADMIN_EMAIL` / `SEED_DEFAULT_PASSWORD`).
2. Navigate: **Admin Dashboard → Launch Preview → Fulfillment Audit**.
3. Open **Seed & Smoke**, verify env vars, run the preview seed command if needed.
4. Switch to **Runtime Smoke Walkthrough** → click **Refresh Walkthrough**.
5. Click **Admin Payments** → filter by `3D-PREVIEW` → confirm payment + assign maker.
6. Click **Maker Jobs** → mark a preview order shipped and add tracking.
7. Click **Customer Dashboard** → verify tracking appears only after shipped.
8. Return to **Audit Checks** → click **Re-run Checks** for PASS/FAIL.

## Pass / Fail Criteria
**Pass when:**
- Preview orders `3D-PREVIEW-A` and `3D-PREVIEW-B` are detected.
- Audit checks pass:
  - Status history sanitized (no actor IDs).
  - Tracking withheld for unshipped orders.
  - Guardrail RPC checks pass.
  - Delivered guard simulation rejects unshipped orders.

**Fail when:**
- No preview orders are detected after seeding.
- Tracking appears before shipment.
- Guardrail or delivered guard checks fail.
