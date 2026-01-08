# PAGES & ROUTES STATUS AUDIT
**Date:** 2026-01-08 09:25 AST  
**Purpose:** Truth map of all pages

---

## LIVE (Functional, accessible)

### Public Pages
- `/` - Index.tsx (1.4KB - minimal landing)
  - Status: NEEDS DISCLOSURE BANNER
  - Brand voice: Needs warmth upgrade

- `/auth` - Auth.tsx (23KB)
  - Status: NEEDS CASL CHECKBOX  
  - Functional: Yes

- `/quote` - QuoteConfigurator.tsx
  - Status: Step 1 works, Steps 2-5 labeled "In Development"
  - NEEDS: API wiring for Step 4

- `/terms` - TermsOfService.tsx (8.8KB)
  - Status: EXISTS, NEEDS CANADA REVIEW

- `/privacy` - PrivacyPolicy.tsx (10KB)
  - Status: EXISTS, NEEDS PIPEDA REVIEW

- `/mission` - Mission.tsx (10KB)
  - Status: Live
  - Brand voice: CHECK IF ALIGNED

- `/about` - About.tsx (10KB)
  - Status: Live
  - Brand voice: CHECK IF ALIGNED

- `/refunds` - Refunds.tsx (8.8KB)
  - Status: Live

- `/community-policy` - CommunityPolicy.tsx (9.5KB)
  - Status: Live

- `/schedule` - Schedule.tsx (4.7KB)
  - Status: Live

- `/recycle-buyback` - RecycleBuyback.tsx (33KB)
  - Status: Live (needs verification)

### Auth-Required Pages

**Customer Dashboard:**
- `/dashboard` - Dashboard.tsx (4.4KB)
- `/dashboard/customer` - CustomerDashboard.tsx (17KB)
- `/dashboard/subscription` - Subscription.tsx (12.8KB)
- `/dashboard/achievements` - Achievements.tsx (5.6KB) - DECORATIVE
- `/dashboard/settings` - ProfileSettings.tsx (15.5KB)
- `/dashboard/rewards` - RewardsCenter.tsx (16.6KB) - DECORATIVE
- `/dashboard/credits` - CreditsStore.tsx (21.4KB) - NEEDS DISCLOSURE
- `/dashboard/credits/checkout` - ETransferCheckout.tsx (14.3KB)
- `/dashboard/community` - CommunityModels.tsx (21.3KB)
- `/dashboard/community-cleanup` - CommunityCleanup.tsx (19.3KB)
- `/dashboard/recycling` - Recycling.tsx (14.5KB)
- `/dashboard/gift-cards` - GiftCards.tsx (12.3KB)

**Maker Dashboard:**
- `/dashboard/maker` - MakerOverview.tsx (10.5KB) - USES MOCK DATA
- `/dashboard/maker/requests` - MakerRequests.tsx (19.2KB)
- `/dashboard/maker/jobs` - MakerJobs.tsx (11.4KB)
- `/dashboard/maker/printers` - MakerPrinters.tsx (17.3KB)
- `/dashboard/maker/filament` - MakerFilament.tsx (13.7KB)
- `/dashboard/maker/earnings` - MakerEarnings.tsx (10.8KB) - USES MOCK DATA
- `/dashboard/maker/profile` - MakerProfile.tsx (10.1KB)

**Admin Dashboard:**
- `/dashboard/admin` - AdminOverview.tsx (4.8KB)
- `/dashboard/admin/content` - AdminContentPromos.tsx (14.7KB)
- `/dashboard/admin/store` - AdminStoreManager.tsx (9.9KB)
- `/dashboard/admin/packages` - AdminCreditPackages.tsx (8.2KB)
- `/dashboard/admin/makers` - AdminMakerManager.tsx (7.3KB)
- `/dashboard/admin/ops` - AdminOperations.tsx (9.4KB)
- `/dashboard/admin/buyback` - AdminBuybackRequests.tsx (15.9KB)

**Additional:**
- `/promo-products` - PromoProducts.tsx (13.1KB)
- `/business-subscription` - BusinessSubscription.tsx (14.5KB)
- `/onboarding` - Onboarding.tsx (15.9KB)

---

## IN DEVELOPMENT (Not fully functional)

- `/quote` Steps 2-5 (labeled honestly)

---

## MISSING (Required by master directive)

- `/brand-games` - REQUIRED, NOT BUILT
- `/careers` - REQUIRED, NOT BUILT

---

## HIDDEN (Should exist but blocked or removed)

None currently

---

## TOTAL COUNT

**Total Routes:** 42  
**Live:** 40  
**In Development:** 1 (quote, partially)  
**Missing:** 2 (brand-games, careers)  
**Decorative (mock data):** 9 (achievements, rewards, maker earnings, maker overview, admin pages)

---

## ACTION REQUIRED

1. Build /brand-games (P1-1)
2. Build /careers (P1-2)
3. Add CASL to /auth (P0-3)
4. Add disclosures to /, /quote, /dashboard/credits (P0-4)
5. Wire /quote Step 4 or hide Steps 2-5 (P0-1)
6. Review /mission and /about for brand voice alignment
7. Decision on 9 decorative dashboard pages (P1-5)
