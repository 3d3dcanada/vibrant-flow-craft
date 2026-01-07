---
project: 3d3d.ca
phase: Phase 1 Vertical Slice
date: 2026-01-07
owner: Program Director
artifact: Master Plan & Execution Roadmap
---

# 3D3D.CA — Phase 1 Master Plan

## Scope Lock

### In Scope
- Premium landing page (hero, trust indicators, how it works, quote preview, testimonials)
- Full quote configurator (5 steps, <10s end-to-end)
- Role-aware navigation (customer/maker/admin)
- Rewards system (achievements, leaderboard, redemption)
- Read-only activity feed (recent prints, maker status)
- Mobile-first responsive design
- Light/dark mode toggle
- Performance: Lighthouse ≥90, <2s mobile load
- Security: Zero RLS violations, OWASP hardening

### Out of Scope
- Payment processing (Stripe, PayPal, Bitcoin)
- Real-time job tracking (WebSockets)
- Model marketplace
- Shipping API integration
- Native mobile apps
- ML-based DFM analysis
- Email notifications
- Push notifications

## 6-Week Delivery Roadmap

### Week 1: Foundation (Jan 7-13)
**Gate 1: Design & API Contracts**
- Design system audit complete
- Component library specs frozen
- API contracts defined (TypeScript + Zod)
- Database schema gaps identified
- Security baseline established

**Deliverables**:
- Component library documentation
- API contract specifications
- RLS audit report
- Performance baseline metrics

### Week 2: Core Infrastructure (Jan 14-20)
**Gate 2: Backend Foundation**
- Quote calculation API live
- File upload API functional
- STL parser integrated (client-side)
- RLS policies verified
- Database indexes optimized

**Deliverables**:
- Working quote API (<500ms)
- File upload endpoint (<10s for 50MB)
- RLS test suite (100% coverage)
- Database migration scripts

### Week 3: Component Library (Jan 21-27)
**Gate 3: UI Components Ready**
- GlassPanel, NeonButton, ProgressIndicator, FileUpload, Toast components
- Storybook documentation
- Dark/light mode support
- Accessibility tested (WCAG 2.1 AA)
- Performance budgets met

**Deliverables**:
- Component library (8+ components)
- Storybook deployment
- Accessibility audit report
- Design tokens enforced

### Week 4: Page Implementation (Jan 28 - Feb 3)
**Gate 4: Quote Flow Complete**
- Landing page live
- Quote configurator (all 5 steps)
- Navigation implemented (all roles)
- Quote flow <10s (95th percentile)
- Mobile responsive (320px+)

**Deliverables**:
- Landing page
- Quote configurator
- Role-based dashboards
- Performance test results

### Week 5: Rewards & Polish (Feb 4-10)
**Gate 5: Security & Features**
- Rewards framework live
- Achievement triggers functional
- Leaderboard operational
- Security audit passed
- Activity feed implemented

**Deliverables**:
- Rewards API
- Achievement system
- Security audit report
- Penetration test results

### Week 6: QA & Launch (Feb 11-17)
**Gate 6: Production Ready**
- Lighthouse ≥90 all pages
- Zero accessibility violations
- Zero RLS violations
- Cross-browser tested
- Load tested (100+ concurrent users)

**Deliverables**:
- QA report
- Performance benchmarks
- Production deployment
- Launch checklist complete

## Ticket Graph (48 Tickets)

### Agent A: UX/Frontend (18 tickets)

**A1**: Design system audit & token extraction
**A2**: Component library setup (Storybook)
**A3**: GlassPanel component + variants
**A4**: NeonButton component + loading states
**A5**: ProgressIndicator component (linear/circular/stepped)
**A6**: FileUpload component (drag-drop, validation)
**A7**: Toast notification system (sonner customization)
**A8**: Landing page - Hero section
**A9**: Landing page - Trust indicators
**A10**: Landing page - How it works
**A11**: Landing page - Quote preview widget
**A12**: Landing page - Testimonials carousel
**A13**: Quote configurator - Step 1 (file upload)
**A14**: Quote configurator - Step 2 (material/options)
**A15**: Quote configurator - Step 3 (quantity/delivery)
**A16**: Quote configurator - Step 4 (price breakdown)
**A17**: Quote configurator - Step 5 (checkout/save)
**A18**: Role-aware navigation (header, mobile, breadcrumbs)

### Agent B: Backend/Infrastructure (16 tickets)

**B1**: Pricing logic audit + unit tests
**B2**: Quote calculation API endpoint
**B3**: File upload API design + implementation
**B4**: STL parser integration (client-side + fallback)
**B5**: RLS policy verification + test suite
**B6**: Database query optimization + indexes
**B7**: Rewards framework - achievement triggers
**B8**: Rewards framework - leaderboard view
**B9**: Rewards framework - redemption API
**B10**: Edge function - file analysis (server-side fallback)
**B11**: Edge function - achievement award
**B12**: Database migration - new indexes
**B13**: Database migration - achievement tables
**B14**: API documentation (OpenAPI spec)
**B15**: Security hardening (rate limiting, input validation)
**B16**: Performance monitoring setup

### Agent C: QA/Security/Performance (8 tickets)

**C1**: Unit test suite setup (Vitest)
**C2**: Integration test suite (quote flow E2E)
**C3**: RLS security tests (all 27 tables)
**C4**: Accessibility audit (axe-core + manual)
**C5**: Performance testing (Lighthouse CI)
**C6**: Load testing (100+ concurrent users)
**C7**: Security audit (OWASP checklist)
**C8**: Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Agent D: Growth/SEO/Content (6 tickets)

**D1**: SEO metadata templates (all pages)
**D2**: Landing page copy (value prop, trust, CTAs)
**D3**: Knowledge hub structure (FAQ, guides)
**D4**: Fredericton local landing strategy
**D5**: Privacy-first analytics setup (Plausible/Fathom)
**D6**: Public launch checklist

## Dependency Graph

```
A1 → A2 → [A3, A4, A5, A6, A7] → [A8-A12] → [A13-A17] → A18
                                      ↓
B1 → B2 → B3 → B4 → B5 → B6 → [B7, B8, B9] → [B10, B11] → [B12, B13] → B14 → B15 → B16
     ↓    ↓                                                                    ↓
    A16  A13                                                                  C7
     
[A3-A7] → C4
[A8-A18] → C5
B2 → C2
B5 → C3
[A8-A18, B2-B16] → C6
[A8-A18] → C8

D1 → [A8-A12]
D2 → [A8-A12]
D3 → (Phase 2)
D4 → A8
D5 → A8
D6 → [C1-C8]
```

**Critical Path** (longest dependency chain):
A1 → A2 → A3 → A8 → A13 → A16 → A18 → C5 → C6 → D6
**Estimated Duration**: 38 days (with 4-day buffer = 42 days / 6 weeks)

## Risk Register

| Risk | Probability | Impact | Mitigation | Stop Trigger |
|------|-------------|--------|------------|--------------|
| STL parser performance bottleneck | Medium | High | Client-side first, server fallback ready | Quote flow >15s on 50th percentile |
| RLS policy gaps | Low | Critical | Automated test suite, manual pen test | Any privilege escalation found |
| Lighthouse score <90 | Medium | High | Code splitting, lazy loading, image optimization | Score <85 after optimization |
| Accessibility violations | Low | High | WCAG audit in Week 3, automated testing | Any WCAG AA violations in production |
| Scope creep | High | Medium | Strict Phase 1 lock, defer all additions | Any out-of-scope work started |
| Mobile performance <2s | Medium | High | Mobile-first development, 4G testing | LCP >3s on mobile |
| Cross-browser bugs | Medium | Medium | Test on all browsers weekly | Critical bug on Safari/Firefox |
| Database performance | Low | High | Index all foreign keys, optimize queries | Query time >200ms |

**Stop-the-Line Triggers**:
1. Critical security vulnerability discovered (CVSS ≥7.0)
2. RLS policy allows unauthorized data access
3. Lighthouse Performance score <80
4. WCAG AA violations in production
5. Quote flow >15 seconds (50th percentile)
6. Database queries >500ms (95th percentile)

## PR & Branch Policy

### Branch Naming
```
<type>/<agent>/<ticket>-<short-description>

Examples:
feature/ux/A8-landing-hero
fix/backend/B5-rls-users
chore/qa/C4-accessibility-audit
```

**Types**: `feature`, `fix`, `chore`, `docs`, `test`, `refactor`

### PR Requirements
- Title: `[<AGENT>] <Type>: <Description> (#<Ticket>)`
- All tests passing (unit + integration)
- Lighthouse score ≥90 (for frontend PRs)
- No accessibility violations (for frontend PRs)
- No RLS violations (for backend PRs)
- Code review by at least one other agent role
- Deployment notes documented

### Merge Policy
- Squash merge to main
- Delete branch after merge
- Deploy to staging immediately
- Deploy to production only after gate approval

## Weekly Research Protocol

**Every Monday 9:00 AM EST**:
1. Review competitor updates (Xometry, Shapeways, MakerWorld, Prusa)
2. Check Hacker News, r/3Dprinting, Twitter for trends
3. Document findings in `docs/research/YYYY-MM-DD_weekly.md`
4. Propose improvements as RFC if applicable
5. Team reviews RFC, approves or defers to future phase

**Research Sources**:
- Xometry blog & product updates
- Shapeways announcements
- Bambu Lab MakerWorld forums
- Prusa blog & GitHub
- 3D printing subreddits
- Industry newsletters (3DPrint.com, Fabbaloo)

**RFC Process**:
1. Create `docs/rfcs/RFC-XXX-<title>.md`
2. Include: Problem, Proposal, Alternatives, Impact, Timeline
3. Team reviews within 48 hours
4. Approve (implement), Defer (Phase 2+), or Reject

## Definition of Done

Phase 1 is complete when:
- [ ] All 48 tickets closed
- [ ] All 6 gates passed
- [ ] Lighthouse ≥90 on all pages
- [ ] Zero accessibility violations (axe-core)
- [ ] Zero RLS violations (automated tests)
- [ ] Quote flow <10s (95th percentile)
- [ ] Mobile load time <2s (4G)
- [ ] Security audit passed (no critical/high vulnerabilities)
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Load tested (100+ concurrent users, no errors)
- [ ] Production deployment successful
- [ ] Launch checklist complete

## Verification

**How this is verified**:
- Automated CI/CD pipeline (GitHub Actions)
- Lighthouse CI on every PR
- Automated accessibility tests (axe-core)
- Automated RLS tests (SQL test suite)
- Manual QA checklist (Agent C)
- Stakeholder approval on gates 1, 3, 6

**What would block production**:
- Any stop-the-line trigger activated
- Any gate not passed
- Critical bug discovered in QA
- Stakeholder rejects design/functionality
- Performance targets not met
- Security vulnerabilities unresolved
