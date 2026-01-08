# DEPLOYMENT PROOF
**Date:** 2026-01-08 08:50 AST  
**Purpose:** Evidence of backend deployment to staging

---

## SUPABASE FUNCTIONS

**Command:** `supabase functions list`  
**Executed:** 2026-01-08 01:42:25 UTC

```
   ID                                   | NAME            | SLUG            | STATUS | VERSION | UPDATED_AT (UTC)
  --------------------------------------|-----------------|-----------------|--------|---------|---------------------
   20737c32-3bf4-42b1-92d5-ed47f2b2594f | calculate-quote | calculate-quote | ACTIVE | 1       | 2026-01-08 01:42:25
```

**Status:** ACTIVE  
**Version:** 1  
**Deployment Timestamp:** 2026-01-08 01:42:25 UTC

**Function URL:** https://eluphamvkevqunnrwkgo.supabase.co/functions/v1/calculate-quote

---

## MIGRATIONS

**Command:** `supabase migration list`  
**Executed:** 2026-01-08 (latest)

```
   Local          | Remote         | Time (UTC)
  ----------------|----------------|---------------------
   20251225100910 | 20251225100910 | 2025-12-25 10:09:10
   20251231061544 | 20251231061544 | 2025-12-31 06:15:44
   20251231072528 | 20251231072528 | 2025-12-31 07:25:28
   20251231075348 | 20251231075348 | 2025-12-31 07:53:48
   20251231080852 | 20251231080852 | 2025-12-31 08:08:52
   20251231105209 | 20251231105209 | 2025-12-31 10:52:09
   20251231133829 | 20251231133829 | 2025-12-31 13:38:29
   20251231174908 | 20251231174908 | 2025-12-31 17:49:08
   20260103185901 | 20260103185901 | 2026-01-03 18:59:01
   20260104021936 | 20260104021936 | 2026-01-04 02:19:36
   20260104022003 | 20260104022003 | 2026-01-04 02:20:03
   20260104022307 | 20260104022307 | 20260-01-04 02:23:07
   20260107143000 | 20260107143000 | 2026-01-07 14:30:00
   20260107143001 | 20260107143001 | 2026-01-07 14:30:01
   20260107143002 | 20260107143002 | 2026-01-07 14:30:02
   20260107143003 | 20260107143003 | 2026-01-07 14:30:03
   20260107143004 | 20260107143004 | 2026-01-07 14:30:04
   20260107143005 | 20260107143005 | 2026-01-07 14:30:05
   20260107143006 | 20260107143006 | 2026-01-07 14:30:06
```

**Total Migrations:** 19  
**All Local = Remote:** YES  
**Sync Status:** Clean

**Phase 1 Migrations (20260107143XXX):**
- 143000: quotes table with RLS
- 143001: print_requests FK references
- 143002: point_transactions fraud flags
- 143003: creator_models royalty tracking
- 143004: quality_points_function
- 143005: RLS policy verification
- 143006: leaked password protection docs

---

## STORAGE BUCKETS

**Status:** NOT CREATED

**Required Action:**  
Create `stl-uploads` bucket via Supabase Dashboard:
- Path: Storage -> New Bucket
- Name: stl-uploads
- Public: No
- Max size: 50MB
- Enable RLS: Yes

**Blocker:** P0 for file upload functionality

---

## BUILD VERIFICATION

**Command:** `npm run build`  
**Status:** SUCCESS  
**Duration:** 16.44s

```
vite v5.4.19 building for production...
✓ 2525 modules transformed
dist/index.html      1.24 kB | gzip: 0.51 kB
dist/index.css     104.52 kB | gzip: 16.95 kB
dist/index.js    1,256.53 kB | gzip: 337.29 kB
✓ built in 16.44s
```

**Warnings:** 
- Chunk size > 500KB (expected, code splitting TODO)
- caniuse-lite 7 months old (non-blocking)
