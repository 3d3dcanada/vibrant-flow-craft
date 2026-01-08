# FRONTEND REALITY
**Date:** 2026-01-08 08:50 AST  
**Purpose:** Honest assessment of what is real vs decorative

---

## ROUTE STATUS

### EXISTS AND WIRED
- `/` - Index.tsx (1.4KB - minimal landing page)
- `/auth` - Auth.tsx (functional authentication)
- `/quote` - QuoteConfigurator.tsx (Step 1 only, Steps 2-5 honest "In Development" UI)

### EXISTS BUT DECORATIVE/MOCK DATA
- `/dashboard/maker/*` - 7 pages with mock earnings, jobs, printer data
- `/dashboard/admin/*` - 7 pages, no Supabase queries visible
- `/dashboard/customer` - Uses mock data
- `/dashboard/achievements` - No backend wiring
- `/dashboard/rewards` - No backend wiring
- `/recycling` - Only page calling supabase.functions.invoke (recycling drop)

### EXISTS AND LIKELY PARTIAL
- `/dashboard/subscription` - May have real Supabase reads
- `/dashboard/settings` - Profile updates may be wired

### MISSING FROM APP.TSX
None identified (40+ routes exist)

---

## QUOTE FLOW REALITY

**File:** src/pages/QuoteConfigurator.tsx

### Step 1: File Upload
- Status: FUNCTIONAL UI
- File selection: Works
- Analysis: Uses demo data (not real STL parsing)
- Demo delay: 800ms setTimeout
- Variable name: `demoAnalysis` (previously mockAnalysis)
- Comment: "DEV NOTE: Real file upload to Supabase Storage + STL parsing not yet wired"

### Step 2: Material Selection
- Status: HONEST PLACEHOLDER
- UI shows: "Step 2: In Development"
- Message: "Material selection is being built. Check back soon."
- Icon: Wrench emoji
- Previous lie removed: "Material selector coming in next commit..."

### Step 3: Quantity/Delivery
- Status: HONEST PLACEHOLDER
- UI shows: "Step 3: In Development"
- Message: "Quantity options are being built. Check back soon."
- Previous lie removed: "Quantity selector coming in next commit..."

### Step 4: Price Breakdown
- Status: HONEST PLACEHOLDER  
- UI shows: "Step 4: In Development"
- Message: "Pricing engine is live - UI integration in progress."
- Backend: calculate-quote function ACTIVE but not called from frontend
- Previous lie removed: "Price breakdown coming in next commit..."

### Step 5: Checkout
- Status: HONEST PLACEHOLDER
- UI shows: "Step 5: In Development"
- Message: "Checkout flow is being built. Payments not yet live."
- Previous lie removed: "Checkout options coming in next commit..."

---

## DECORATIVE VS WIRED PAGES

### DECORATIVE (Mock/Static Data)
**Admin Dashboard (7 pages):**
- AdminOverview.tsx
- AdminBuybackRequests.tsx
- AdminContentPromos.tsx
- AdminCreditPackages.tsx
- AdminMakerManager.tsx
- AdminOperations.tsx
- AdminStoreManager.tsx

**Maker Dashboard (7 pages with confirmed mocks):**
- MakerOverview.tsx (mock earnings calculations)
- MakerEarnings.tsx ("Mock earnings calculations" comment, line 36)
- MakerJobs.tsx
- MakerRequests.tsx
- MakerPrinters.tsx
- MakerFilament.tsx
- MakerProfile.tsx

**Customer Pages:**
- Achievements.tsx (gamification not wired)
- RewardsCenter.tsx (no backend triggers)
- CreditsStore.tsx (payment flow not live)

### WIRED (Real Supabase Calls)
- Auth.tsx (Supabase Auth SDK)
- Recycling.tsx (calls submit-recycling-drop function)
- Possibly: ProfileSettings.tsx, Subscription.tsx

### UNKNOWN (Needs Audit)
- CommunityModels.tsx
- CommunityCleanup.tsx
- GiftCards.tsx
- BusinessSubscription.tsx
- RecycleBuyback.tsx

---

## MOCK DATA CATALOG

### QuoteConfigurator.tsx (Line 47-67)
```typescript
// Demo analysis data - real parsing will replace this
const demoAnalysis: FileAnalysis = {
    weight: 50,
    dimensions: { x: 100, y: 100, z: 50 },
    estimatedPrintTime: 3.5,
    volume: 500000,
};

// Demo delay to simulate analysis
await new Promise(resolve => setTimeout(resolve, 800));
```

### MakerOverview.tsx (Line 30-35)
```typescript
// Calculate on-time percentage (mock for now)
const onTimePercentage = 94;

// Calculate earnings (mock - would need actual payment data)
const totalEarnings = 1247.50;
```

### MakerEarnings.tsx (Line 36-48)
```typescript
// Mock earnings calculations (would be real in production)
const totalEarnings = 1247.50;
const pendingEarnings = 320.00;
const availableForWithdrawal = totalEarnings - pendingEarnings;

// ... more mock values
const avgJobValue = 25; // Mock
```

---

## FAKE DELAYS

**Location:** src/pages/QuoteConfigurator.tsx, line 53  
**Code:** `await new Promise(resolve => setTimeout(resolve, 800));`  
**Purpose:** Simulate STL file analysis  
**Label:** Clearly marked as "Demo delay"

---

## /QUOTE ROUTE STATUS

**Status:** WIRED (as of commit c6a3f63)

**Evidence:**
- src/App.tsx line 36: `import QuoteConfigurator from "./pages/QuoteConfigurator";`
- src/App.tsx line 79: `<Route path="/quote" element={<QuoteConfigurator />} />`

**Previously:** Orphaned (QuoteConfigurator existed but no route)  
**Now:** Accessible at /quote

**Functionality:** 
- Step 1 works with demo data
- Steps 2-5 show honest "In Development" messaging
- Does NOT call calculate-quote Edge Function yet
