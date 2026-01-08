# UX TRUST AUDIT
**Date:** 2026-01-08 09:25 AST  
**Lens:** "Someone like me built this, and I can trust it"

---

## TRUST BUILDERS (What feels real)

### Backend Infrastructure
- **Status:** REAL
- **Evidence:** calculate-quote ACTIVE v1, 19 migrations deployed
- **Impact:** HIGH - proves actual engineering
- **Visible to user:** No (but builds confidence if mentioned)

### /quote Step 1 (File Upload)
- **Status:** FUNCTIONAL (with demo data clearly labeled)
- **Evidence:** File selection works, demo data commented in code
- **Impact:** MEDIUM - user can interact
- **Visible to user:** Yes
- **Trust factor:** "I can upload a file and see something happen"

### Honest "In Development" messaging
- **Status:** IMPLEMENTED (Steps 2-5)
- **Evidence:** Replaced "coming in next commit" with wrench icon + clear labels
- **Impact:** HIGH - respects user intelligence
- **Visible to user:** Yes
- **Trust factor:** "They're not lying to me about readiness"

### Real Privacy & Terms pages
- **Status:** EXIST (need review)
- **Evidence:** PrivacyPolicy.tsx (10KB), TermsOfService.tsx (8.8KB)
- **Impact:** MEDIUM - shows legal awareness
- **Visible to user:** Yes (if they look)
- **Trust factor:** "They thought about legal stuff"

---

## TRUST BREAKERS (What feels fake or misleading)

### Mock data visible as real
- **Where:** MakerEarnings.tsx, MakerOverview.tsx
- **Evidence:** Comments saying "mock" and "would be real in production"
- **Impact:** HIGH if user sees it
- **Visible to user:** Only if authenticated as maker
- **Action:** MUST HIDE OR WIRE (P1-5)

### No CASL consent
- **Where:** Signup flow
- **Evidence:** No checkbox, no logging
- **Impact:** HIGH - illegal in Canada
- **Visible to user:** Not visible = problem
- **Action:** MUST ADD (P0-3)

### No "payments not live" disclosure
- **Where:** Landing, quote flow, credits store
- **Evidence:** None visible
- **Impact:** HIGH - misleading if prices shown without context
- **Visible to user:** Not visible = problem
- **Action:** MUST ADD (P0-4)

### Decorative dashboards
- **Where:** Admin (7 pages), Achievements, Rewards
- **Evidence:** No Supabase queries visible
- **Impact:** MEDIUM - feels hollow if accessed
- **Visible to user:** Only if authenticated
- **Action:** HIDE OR WIRE (P1-5)

### Missing Brand-Games
- **Where:** Nowhere (not built)
- **Evidence:** User directive requires it
- **Impact:** MEDIUM - missing promised differentiator
- **Visible to user:** Not visible = incomplete
- **Action:** BUILD (P1-1)

### Missing Careers
- **Where:** Nowhere (not built)
- **Evidence:** User directive requires it
- **Impact:** MEDIUM - signals lack of growth intent
- **Visible to user:** Not visible = less credible
- **Action:** BUILD (P1-2)

---

## BRAND VOICE ALIGNMENT

### Required Tone: "Warm, kind, curious"

**Current landing page:**
- Unknown (Index.tsx is only 1.4KB)
- **Action:** Review and upgrade to match voice

**Quote flow:**
- Neutral, functional
- **Action:** Add warmth ("Let's bring your idea to life")

**About/Mission:**
- Unknown without content audit
- **Action:** Review for alignment

**Desired voice examples:**
- "Hey, I'm your imagination — let's run wild together"
- "Let's innovate"
- "Your mind is the limit"
- "Built by a maker, for makers"

**Current voice:** Likely too technical/corporate
**Gap:** HIGH
**Action:** Content pass on key pages

---

## VISUAL TRUST SIGNALS

### What works:
- Cyber-luxe design system (looks premium)
- Glassmorphism panels (modern, clean)
- Consistent component library
- Build passes (no broken UI)

### What's missing:
- Friendly imagery (too tech-focused)
- Warmth in color palette (consider softer accent)
- Human touch (photos? maker stories?)
- Clear value prop on landing

### What breaks trust:
- Nothing visible breaking trust yet
- But: Mock data if seen, missing disclosures

---

## USER JOURNEY AUDIT

### Guest user lands on site
1. **Sees:** Landing page (needs disclosure banner)
   - Trust: UNKNOWN (needs content review)
   - Action: Add "Payments not live" banner

2. **Clicks "Get Quote":** Reaches /quote
   - Trust: MEDIUM (can upload file, see demo)
   - Gap: Steps 2-5 not functional
   - Action: Wire Step 4 or clearly label entire flow as "Preview"

3. **Tries to sign up:** Reaches /auth
   - Trust: HIGH (real auth)
   - Gap: No CASL checkbox
   - Action: Add checkbox (P0-3)

4. **Explores site:** Finds About, Mission, Terms
   - Trust: MEDIUM (pages exist)
   - Gap: Brand voice may not be warm
   - Action: Content review

5. **Looks for careers/partnership:** Finds nothing
   - Trust: LOW (no signals of growth)
   - Action: Add /careers (P1-2)

6. **Looks for "what makes this different":** No Brand-Games
   - Trust: LOW (feels like every other platform)
   - Action: Add /brand-games (P1-1)

---

## AUTHENTICITY SIGNALS

### Present:
- Real backend (migrations, Edge Functions)
- Honest development labels
- Real legal pages
- Canadian jurisdiction

### Missing:
- Founder story / human element
- Maker testimonials (future)
- Community proof (future)
- "Why we're different" (Brand-Games missing)

---

## TRUST SCORE BY AREA

| Area | Trust Level | Primary Issue |
|------|-------------|---------------|
| Landing | UNKNOWN | Needs content review + disclosure |
| Quote Flow | MEDIUM | Steps 2-5 not functional, Step 4 not wired |
| Authentication | HIGH | Works, needs CASL |
| Legal Pages | MEDIUM | Exist, need Canada review |
| Dashboards | LOW | Mock data visible |
| Brand Voice | LOW | Likely too corporate |
| Differentiators | LOW | Brand-Games missing |
| Growth Signals | LOW | Careers missing |
| Compliance | FAIL | CASL + disclosures missing |

**Overall Trust:** MEDIUM (functional but incomplete)

---

## RECOMMENDED TRUST UPGRADES

### Quick wins (1-2 hours each):
1. Add "Payments not live" banners (P0-4)
2. Add CASL checkbox (P0-3)
3. Content pass on landing page for warmth
4. Add founder note ("Built solo by a maker in Fredericton")

### Medium effort (3-4 hours each):
1. Wire Step 4 to API (P0-1)
2. Build Brand-Games page (P1-1)
3. Build Careers page (P1-2)
4. Hide decorative dashboards (P1-5)

### High effort (8+ hours):
1. Full brand voice pass on all pages
2. Wire all dashboards to real data
3. Add human elements (photos, stories)
4. Professional legal review

---

## GO/NO-GO FOR TRUST

**Minimum trust baseline:**
- [ ] No mock data visible as real
- [ ] CASL compliance visible
- [ ] "Payments not live" disclosed
- [ ] Brand-Games page exists (differentiator)
- [ ] Careers page exists (growth signal)
- [ ] Landing page has warm, honest tone

**Launch-ready if:** 6/6 minimum baseline met

**Trust will improve with:**
- Testimonials (post-launch)
- Community activity (post-launch)
- Maker stories (post-launch)
- Professional polish (ongoing)

---

## FINAL ASSESSMENT

**Current state:** Infrastructure is real, presentation needs honesty upgrades

**Key gap:** Legal compliance (CASL, disclosures)

**Secondary gap:** Missing differentiators (Brand-Games, Careers)

**Tone gap:** Likely too technical, needs warmth

**Trust readiness:** 50% (functional but incomplete)

**Path to 90% trust:**
1. Fix legal (CASL + disclosures)
2. Add missing pages (Brand-Games + Careers)
3. Content pass for warmth
4. Hide or wire mock dashboards

**Timeline:** 7-12 days if executed sequentially per plan
