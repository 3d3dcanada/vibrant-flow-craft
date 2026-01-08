# A1: Design System Audit

## Status: IN PROGRESS

## Findings

### Existing Components (CSS-based, no framer-motion)
- ✅ `NeonButton.tsx` - Fully CSS animated (shimmer, hover, scale)
- ✅ `GlowCard.tsx` - CSS transitions (lift, glow effects)
- ✅ Tailwind animations configured in `tailwind.config.ts`

### Framer-Motion Usage (TO REMOVE)
Found in 31 files:
- Pages: Auth, BusinessSubscription, CommunityCleanup, CreditsStore, ETransferCheckout, GiftCards, Mission, Onboarding, ProfileSettings, PromoProducts, RecycleBuyback, Recycling, Refunds, RewardsCenter, Schedule, Subscription, TermsOfService
- Admin pages: AdminBuybackRequests, AdminContentPromos, AdminCreditPackages, AdminMakerManager, AdminOperations, AdminOverview, AdminStoreManager
- Maker pages: MakerEarnings, MakerFilament, MakerJobs, MakerOverview, MakerPrinters, MakerProfile, MakerRequests

### Design Tokens (from tailwind.config.ts)
**Colors (Dark Mode)**:
- Background: `233 75% 3%` (deep space black)
- Card: `235 40% 6%`
- Primary (Magenta): `300 100% 50%`
- Secondary (Teal): `177 100% 50%`
- Accent (Blue): `217 91% 60%`

**Typography**:
- Sans: Inter
- Tech: Rajdhani
- Display: Space Grotesk

**Animations** (20+ keyframes):
- float, pulse-glow, scan, shimmer, gradient-shift, breathe, ticker, spin-slow, glow-pulse, border-glow, text-flicker, marquee, expand-width, slide-up, fade-in, scale-in, rotate-glow

### Component Library Gaps
**Need to create**:
1. `GlassPanel.tsx` - Standardized glass morphism container
2. `ProgressIndicator.tsx` - Linear/circular/stepped progress
3. `FileUpload.tsx` - Drag-drop file upload with validation
4. `Toast.tsx` - Customize sonner for cyberpunk theme

**Existing but need review**:
- `PricingBreakdown.tsx` - Check if uses framer-motion
- `MaterialCard.tsx` - Check animations
- `StatsCounter.tsx` - Check number animations

## Action Items

### Phase 1: Framer-Motion Removal
- [ ] Create CSS animation replacements for common patterns
- [ ] Update 31 pages to use CSS animations
- [ ] Remove framer-motion from package.json
- [ ] Test all animations still work

### Phase 2: Component Library
- [ ] Create GlassPanel component
- [ ] Create ProgressIndicator component  
- [ ] Create FileUpload component
- [ ] Customize Toast (sonner)
- [ ] Document all components in Storybook

### Phase 3: Design Token Enforcement
- [ ] Create ESLint rule to prevent hardcoded colors
- [ ] Audit existing components for hardcoded values
- [ ] Update components to use design tokens

## Next Steps
1. Create branch for framer-motion removal
2. Start with Auth.tsx as template
3. Create reusable CSS animation utilities
4. Systematically update all 31 files
