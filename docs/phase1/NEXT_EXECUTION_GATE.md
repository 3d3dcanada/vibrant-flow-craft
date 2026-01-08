# NEXT EXECUTION GATE
**Date:** 2026-01-08 08:50 AST  
**Purpose:** Single next action with exact instructions

---

## ONE NEXT ACTION

**Wire Quote Step 4 to calculate-quote Edge Function**

This is the highest-leverage action because:
- Backend is deployed and verified (ACTIVE v1)
- Frontend route exists (/quote)
- Only missing piece is API call from UI to backend
- Unblocks E2E testing
- Unblocks demo-ability

---

## EXACT FILES TO EDIT

### File 1: src/pages/QuoteConfigurator.tsx

**Add at top (after existing imports):**
```tsx
import { supabase } from '@/integrations/supabase/client';
```

**Add state variables (after line 37):**
```tsx
const [priceBreakdown, setPriceBreakdown] = useState<any>(null);
const [loadingPrice, setLoadingPrice] = useState(false);
const [priceError, setPriceError] = useState<string | null>(null);
```

**Add function (after handleFileUpload):**
```tsx
const fetchQuote = async () => {
    if (!quoteData.analysis) return;
    
    setLoadingPrice(true);
    setPriceError(null);
    
    const { data, error } = await supabase.functions.invoke('calculate-quote', {
        body: {
            grams: quoteData.analysis.weight,
            material: quoteData.materialType,
            quality: 'standard',
            quantity: quoteData.quantity,
            delivery_speed: quoteData.deliverySpeed,
        }
    });
    
    if (error) {
        console.error('[Quote] API Error:', error);
        setPriceError(error.message || 'Failed to calculate price');
    } else {
        console.log('[Quote] Price calculated:', data);
        setPriceBreakdown(data);
    }
    
    setLoadingPrice(false);
};
```

**Replace Step 4 content (lines 213-230):**
```tsx
{/* Step 4: Price Breakdown */}
{currentStep === 4 && (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-tech font-bold text-foreground mb-2">
                Step 4: Price Breakdown
            </h2>
            <p className="text-muted-foreground">
                Transparent pricing, no hidden fees
            </p>
        </div>

        {!priceBreakdown && !loadingPrice && !priceError && (
            <div className="text-center py-8">
                <NeonButton onClick={fetchQuote}>
                    Calculate Price
                </NeonButton>
            </div>
        )}

        {loadingPrice && (
            <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Calculating price...</p>
            </div>
        )}

        {priceError && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                <p className="text-destructive font-tech">Error: {priceError}</p>
                <NeonButton onClick={fetchQuote} className="mt-4">
                    Try Again
                </NeonButton>
            </div>
        )}

        {priceBreakdown && (
            <div className="space-y-4">
                <div className="bg-background/50 border border-border/50 rounded-lg p-6">
                    <div className="flex justify-between text-lg font-tech mb-2">
                        <span>Material Cost:</span>
                        <span>${priceBreakdown.material_cost?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-tech mb-2">
                        <span>Labor:</span>
                        <span>${priceBreakdown.labor_cost?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-tech mb-2">
                        <span>Platform Fee:</span>
                        <span>${priceBreakdown.platform_fee?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="border-t border-border/50 my-4"></div>
                    <div className="flex justify-between text-2xl font-tech font-bold text-primary">
                        <span>Total:</span>
                        <span>${priceBreakdown.total_price?.toFixed(2) || '0.00'}</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                    Note: Payments not yet live. This is a price estimate only.
                </p>
            </div>
        )}
    </div>
)}
```

---

## EXACT COMMANDS TO RUN

### 1. Build verification
```bash
cd e:\3d3d\3d3dag\vibrant-flow-craft
npm run build
```

**Expected:** Clean build, no TypeScript errors  
**Pass:** Exit code 0, dist/ folder created  
**Fail:** Any TypeScript error about supabase client import

### 2. Test in browser (manual)
```bash
npm run dev
```

Then navigate to: `http://localhost:5173/quote`

**Actions to test:**
1. Upload any file
2. Click "Next Step" (3 times to reach Step 4)
3. Click "Calculate Price" button
4. Observe browser console for API call

### 3. Commit
```bash
git add src/pages/QuoteConfigurator.tsx
git commit -m "feat: wire Step 4 to calculate-quote Edge Function

- Add supabase client import
- Add price state management
- Add fetchQuote function calling calculate-quote API
- Replace placeholder with real price display
- Add loading and error states
- Add 'Payments not yet live' disclosure

Backend: calculate-quote ACTIVE v1 verified
Route: /quote confirmed working"
```

---

## EXACT EVIDENCE REQUIRED

### Must Provide:

1. **Browser Console Screenshot/Log**
   - Showing: `[Quote] Price calculated:` with response object
   - OR: `[Quote] API Error:` with error details

2. **Network Tab Evidence**
   - POST request to /functions/v1/calculate-quote
   - Status code (200 or error code)
   - Response body

3. **Build Output**
   - Full output of `npm run build`
   - Must show: `✓ built in X.XXs`

4. **Commit Hash**
   - Output of: `git log --oneline -1`

### Pass Criteria:

- Build succeeds without errors
- API call reaches calculate-quote function
- Response appears in console (success OR documented error)
- No placeholder text visible in Step 4

### Fail Criteria:

- TypeScript errors on build
- No API call made when button clicked
- Placeholder text still visible in Step 4
- Silent failure (no console output)

---

## BLOCKED BY THIS GATE

Cannot proceed until Step 4 API call proven working:
- P0-C-E2E: E2E test suite (needs testable flow)
- P1-A-QUOTE-STEPS: Steps 2, 3, 5 (all depend on Step 4 working)
- Demo/walkthrough video creation
- User acceptance testing

---

## ROLLBACK PLAN

If this fails:

1. Revert commit:
   ```bash
   git reset --hard HEAD~1
   ```

2. Document exact error in:
   `docs/phase1/STEP4_FAILURE_LOG.md`

3. Check:
   - Is supabase client configured? (`src/integrations/supabase/client.ts` exists?)
   - Are environment variables set? (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
   - Does calculate-quote accept the payload structure?

4. Fix root cause before re-attempting

---

## ESTIMATED TIME

**Best case:** 30 minutes (clean implementation, works first try)  
**Realistic:** 1-2 hours (debugging CORS, payload structure, or edge cases)  
**Worst case:** 4 hours (environment issues, need to regenerate Supabase keys)
