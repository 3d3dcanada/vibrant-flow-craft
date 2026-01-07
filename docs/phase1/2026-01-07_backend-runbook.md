---
project: 3d3d.ca
phase: Phase 1 Vertical Slice
date: 2026-01-07
owner: Agent B
artifact: Backend Deployment Runbook
---

# Backend Deployment Runbook

## Overview

This runbook provides step-by-step instructions for deploying Phase 1 backend changes to staging and production environments.

---

## Prerequisites

### Required Tools

| Tool | Required Version | Check Command |
|------|-----------------|---------------|
| Supabase CLI | ≥ 2.67.0 | `supabase --version` |
| Deno | ≥ 1.40.0 | `deno --version` |
| Git | Any | `git --version` |
| Node.js | ≥ 18.0.0 | `node --version` |

### Required Access

- [ ] Supabase Dashboard access (owner/admin)
- [ ] Database connection string (for staging)
- [ ] Service role key (for Edge Functions)
- [ ] Git repository write access

### Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
# Edit .env.local with actual values
```

Required variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Pre-Deployment Checklist

### 1. Verify Local Environment

```bash
# Check Supabase CLI
supabase --version
# Expected: 2.67.1 or higher

# Check Deno
deno --version
# Expected: deno 1.40.x or higher

# Check Git status
git status
# Expected: Clean working tree on feature/ux/A1-design-system-audit
```

### 2. Run Unit Tests

```bash
# Run all Edge Function tests
deno test supabase/functions/calculate-quote/test.ts

# Expected: All tests pass
```

### 3. Verify Migrations

```bash
# List migrations
ls supabase/migrations/ | grep "20260107"

# Expected:
# 20260107_001_create_quotes_table.sql
# 20260107_002_alter_print_requests.sql
# 20260107_003_alter_point_transactions.sql
# 20260107_004_alter_creator_models.sql
# 20260107_005_create_quality_points_function.sql
# 20260107_006_add_rls_policies.sql
# 20260107_007_enable_leaked_password_protection.sql
```

---

## Staging Deployment

### Step 1: Link to Staging Project

```bash
# Login to Supabase
supabase login

# Link to staging project
supabase link --project-ref <staging-project-ref>
```

### Step 2: Backup Staging Database

```bash
# Create backup before migration
supabase db dump -f backup_staging_$(date +%Y%m%d_%H%M%S).sql
```

### Step 3: Apply Migrations

```bash
# Push migrations to staging
supabase db push

# Expected output:
# Applying migration 20260107_001_create_quotes_table.sql...
# Applying migration 20260107_002_alter_print_requests.sql...
# (etc.)
# All migrations applied successfully.
```

### Step 4: Deploy Edge Functions

```bash
# Deploy calculate-quote function
supabase functions deploy calculate-quote

# Expected output:
# Deployed function calculate-quote
```

### Step 5: Run RLS Tests

```bash
# Open SQL Editor in Supabase Dashboard
# Paste contents of docs/phase1/2026-01-07_rls-test-suite.sql
# Execute and verify all tests pass
```

### Step 6: Smoke Tests

#### Test 1: Quote Calculation

```bash
curl -X POST 'https://<staging-project>.supabase.co/functions/v1/calculate-quote' \
  -H 'Authorization: Bearer <anon_key>' \
  -H 'Content-Type: application/json' \
  -d '{
    "grams": 100,
    "material": "PLA_STANDARD",
    "quality": "standard",
    "quantity": 1,
    "delivery_speed": "standard"
  }'
```

**Expected Response:**
```json
{
  "quote_id": "uuid-string",
  "expires_at": "2026-01-14T...",
  "breakdown": {
    "platform_fee": 5.00,
    "bed_rental": 10.00,
    "filament_cost": 9.00,
    "total": 24.00
  }
}
```

#### Test 2: Verify Quote in Database

```sql
-- In Supabase SQL Editor
SELECT * FROM quotes ORDER BY created_at DESC LIMIT 1;
```

#### Test 3: RLS Policy Check

```sql
-- Verify customer can only see own quotes
-- (Use test account in Supabase Auth)
```

---

## Production Deployment

### Pre-Production Checklist

- [ ] Staging deployment successful
- [ ] All smoke tests pass on staging
- [ ] RLS tests pass on staging
- [ ] Team notified of deployment window
- [ ] Rollback plan reviewed
- [ ] Database backup taken

### Step 1: Link to Production Project

```bash
supabase link --project-ref <production-project-ref>
```

### Step 2: Backup Production Database

```bash
# CRITICAL: Always backup before production migration
supabase db dump -f backup_prod_$(date +%Y%m%d_%H%M%S).sql
```

### Step 3: Apply Migrations

```bash
# Apply migrations to production
supabase db push

# Monitor for errors
# If any migration fails, STOP and assess
```

### Step 4: Deploy Edge Functions

```bash
supabase functions deploy calculate-quote
```

### Step 5: Enable Leaked Password Protection

1. Open Supabase Dashboard
2. Navigate to: Authentication → Policies
3. Enable "Leaked Password Protection"
4. Save changes

### Step 6: Post-Deployment Verification

```bash
# Run production smoke test
curl -X POST 'https://<production-project>.supabase.co/functions/v1/calculate-quote' ...

# Verify response matches expected format
```

---

## Rollback Plan

### If Migration Fails

1. **Stop immediately** — Do not apply further migrations
2. **Assess error** — Check Supabase logs
3. **Restore backup** — If data corrupted

```bash
# Restore from backup
psql <database_url> < backup_prod_YYYYMMDD_HHMMSS.sql
```

### If Edge Function Fails

```bash
# Rollback to previous version
supabase functions deploy calculate-quote --version <previous>

# Or delete and redeploy
supabase functions delete calculate-quote
# Fix issue, then redeploy
```

### Manual Rollback (Nuclear Option)

If all else fails, manually execute rollback scripts:

```sql
-- Run in Supabase SQL Editor (REVERSE ORDER)

-- Rollback 007 (documentation only, no action needed)

-- Rollback 006 (verification only, no action needed)

-- Rollback 005
DROP FUNCTION IF EXISTS public.calculate_quality_points;

-- Rollback 004
ALTER TABLE public.creator_models 
  DROP COLUMN IF EXISTS designer_royalty_rate,
  DROP COLUMN IF EXISTS total_royalties_earned,
  DROP COLUMN IF EXISTS complexity_score,
  DROP COLUMN IF EXISTS originality_score,
  DROP COLUMN IF EXISTS quality_flags;

-- Rollback 003
ALTER TABLE public.point_transactions 
  DROP COLUMN IF EXISTS quality_score,
  DROP COLUMN IF EXISTS verification_status,
  DROP COLUMN IF EXISTS verification_notes,
  DROP COLUMN IF EXISTS fraud_flags,
  DROP COLUMN IF EXISTS verified_by,
  DROP COLUMN IF EXISTS verified_at;

-- Rollback 002
ALTER TABLE public.print_requests 
  DROP COLUMN IF EXISTS quote_id,
  DROP COLUMN IF EXISTS file_volume_cm3,
  DROP COLUMN IF EXISTS file_weight_grams,
  DROP COLUMN IF EXISTS dfm_warnings,
  DROP COLUMN IF EXISTS reorder_of_request_id;

-- Rollback 001
DROP TABLE IF EXISTS public.quotes CASCADE;
```

---

## Stop-the-Line Conditions

**STOP deployment immediately if:**

- [ ] Any migration fails with error
- [ ] RLS test fails (security vulnerability)
- [ ] Edge Function returns 500 errors
- [ ] Database connection issues
- [ ] Unexpected data in production tables
- [ ] User reports of broken functionality

**Escalation Path:**
1. Stop deployment
2. Notify team lead
3. Document issue
4. Execute rollback if needed
5. Post-mortem after resolution

---

## Monitoring

### Supabase Dashboard

- **Database → Logs** — Check for SQL errors
- **Edge Functions → Logs** — Check for function errors
- **Auth → Users** — Verify no authentication issues

### Key Metrics

| Metric | Expected | Alert Threshold |
|--------|----------|-----------------|
| Edge Function latency | < 500ms | > 2s |
| Edge Function errors | 0% | > 1% |
| Database connections | < 20 | > 50 |
| RLS policy denials | Expected | Unexpected patterns |

---

## Post-Deployment Tasks

1. [ ] Verify all smoke tests pass
2. [ ] Monitor logs for 1 hour
3. [ ] Notify team of successful deployment
4. [ ] Update deployment log
5. [ ] Close deployment ticket

---

*Runbook — Agent B — 2026-01-07*
