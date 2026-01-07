---
project: 3d3d.ca
phase: Phase 1 Vertical Slice
date: 2026-01-07
owner: Agent C (QA/Security/Performance)
artifact: QA, Security & Performance Gate
---

# Agent C: QA, Security & Performance Gate

## DO / DO NOT

### DO
- Block deployment if any gate fails
- Run all tests before approving PR
- Test on real devices (not just DevTools)
- Use automated tools (Lighthouse CI, axe-core)
- Document all test failures with reproduction steps
- Verify fixes before closing tickets
- Test edge cases and error states
- Check performance on slow networks (3G)

### DO NOT
- Approve PR without running tests
- Skip accessibility testing
- Ignore performance regressions
- Allow hardcoded test data in production
- Skip cross-browser testing
- Approve without verifying RLS policies
- Allow fake/dead UI in production
- Skip security checklist

## Quality Gates

### Gate 1: Design & API Contracts (Week 1)
**Criteria**:
- [ ] Component library specs documented
- [ ] API contracts defined (TypeScript + Zod)
- [ ] Design tokens extracted and enforced
- [ ] Accessibility requirements documented
- [ ] Performance budgets defined

**Tests**:
- Manual review of component specs
- TypeScript compilation check
- Design token extraction verified

**Blocker**: Missing API contract or component spec

---

### Gate 2: Backend Foundation (Week 2)
**Criteria**:
- [ ] Quote API responds <500ms (95th percentile)
- [ ] File upload API handles 50MB files <10s
- [ ] All RLS policies have automated tests
- [ ] Database indexes created
- [ ] Zero RLS violations in test suite

**Tests**:
```bash
# Unit tests
npm run test

# RLS tests
psql $DATABASE_URL -f supabase/tests/rls_tests.sql

# Performance test
npm run test:perf -- --endpoint /api/quote/calculate --requests 100
```

**Blocker**: Any RLS test failure, API >1s response time

---

### Gate 3: UI Components Ready (Week 3)
**Criteria**:
- [ ] All components in Storybook
- [ ] Dark/light mode functional
- [ ] Keyboard navigation works
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Zero accessibility violations (axe-core)
- [ ] Performance budget met (<200KB JS)

**Tests**:
```bash
# Build Storybook
npm run build-storybook

# Accessibility tests
npm run test:a11y

# Bundle size check
npm run build && ls -lh dist/assets/*.js
```

**Manual Tests**:
- Tab through all components (keyboard only)
- Test with NVDA (Windows) or VoiceOver (Mac)
- Toggle dark/light mode, verify all components

**Blocker**: Any WCAG AA violation, bundle >250KB

---

### Gate 4: Quote Flow Complete (Week 4)
**Criteria**:
- [ ] Quote flow <10s (95th percentile)
- [ ] All 5 steps functional
- [ ] Mobile responsive (320px+)
- [ ] Lighthouse Performance ≥90
- [ ] LCP <2.5s, FID <100ms, CLS <0.1

**Tests**:
```bash
# E2E test
npm run test:e2e -- quote-flow

# Lighthouse CI
npm run lighthouse -- --url http://localhost:5173/quote
```

**Manual Tests**:
1. Open /quote on mobile (real device or DevTools)
2. Upload 10MB STL file
3. Select material, quantity, delivery
4. Verify price calculation accurate
5. Submit quote
6. Verify confirmation page

**Blocker**: Quote flow >15s, Lighthouse <85, any step broken

---

### Gate 5: Security & Features (Week 5)
**Criteria**:
- [ ] Rewards API functional
- [ ] Achievement triggers working
- [ ] Leaderboard displays correctly
- [ ] Security audit passed (OWASP checklist)
- [ ] No critical/high vulnerabilities (`npm audit`)
- [ ] Rate limiting implemented

**Tests**:
```bash
# Security audit
npm audit --audit-level=high

# Rate limit test
npm run test:rate-limit -- --endpoint /api/quote/calculate --requests 20
```

**Manual Tests**:
1. Earn points (social share, recycling)
2. Unlock achievement (first print)
3. Redeem points for credits
4. Verify leaderboard updates
5. Test rate limiting (exceed limit, verify 429 error)

**Blocker**: Any critical vulnerability, rate limiting not working

---

### Gate 6: Production Ready (Week 6)
**Criteria**:
- [ ] Lighthouse ≥90 all pages
- [ ] Zero accessibility violations
- [ ] Zero RLS violations
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Load tested (100+ concurrent users)
- [ ] All console errors resolved
- [ ] SEO meta tags present

**Tests**:
```bash
# Full test suite
npm run test:all

# Load test
npm run test:load -- --users 100 --duration 60s

# Lighthouse all pages
npm run lighthouse:all
```

**Manual Tests**:
1. Test on Chrome, Firefox, Safari, Edge (latest versions)
2. Test on iOS Safari, Android Chrome
3. Verify responsive at 320px, 768px, 1024px, 1920px
4. Check all links/buttons functional
5. Verify 404/500 error pages styled

**Blocker**: Lighthouse <85, any browser broken, load test failures

## Test Strategy

### Unit Tests (Vitest)

**Coverage Target**: 95%+ for business logic

**Files to Test**:
- `src/config/pricing.ts`: All pricing scenarios
- `src/config/rewards.ts`: All reward calculations
- `src/config/credits.ts`: Credit conversions
- `src/lib/utils.ts`: Utility functions

**Example Test** (`src/config/pricing.test.ts`):
```typescript
import { describe, it, expect } from 'vitest';
import { calculateQuoteBreakdown } from './pricing';

describe('calculateQuoteBreakdown', () => {
  it('enforces minimum order total', () => {
    const result = calculateQuoteBreakdown({
      materialType: 'PLA_STANDARD',
      grams: 10,
      qty: 1,
      jobSize: 'small',
      deliverySpeed: 'standard',
      postProcessingEnabled: false,
      postProcessingTier: 'standard',
      postProcessingMinutes: 0,
      isMember: false,
    });
    
    expect(result.total).toBe(18.00);
  });
  
  it('applies quantity discount at 10+ units', () => {
    const result = calculateQuoteBreakdown({
      materialType: 'PLA_STANDARD',
      grams: 100,
      qty: 10,
      jobSize: 'medium',
      deliverySpeed: 'standard',
      postProcessingEnabled: false,
      postProcessingTier: 'standard',
      postProcessingMinutes: 0,
      isMember: false,
    });
    
    expect(result.quantityDiscount).toBeGreaterThan(0);
  });
});
```

**Run**: `npm run test`

---

### Integration Tests (Playwright)

**Coverage**: Critical user flows

**Tests to Write**:
1. Quote flow (upload → configure → submit)
2. Login flow (email/password)
3. Rewards redemption (points → credits)
4. Maker job claim (view → claim → update)

**Example Test** (`tests/quote-flow.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test('complete quote flow', async ({ page }) => {
  await page.goto('/quote');
  
  // Step 1: Upload file
  await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample.stl');
  await expect(page.locator('text=sample.stl')).toBeVisible();
  await page.click('button:has-text("Next")');
  
  // Step 2: Select material
  await page.click('input[value="PLA_STANDARD"]');
  await page.click('button:has-text("Next")');
  
  // Step 3: Quantity
  await page.click('button:has-text("5")');
  await page.click('button:has-text("Next")');
  
  // Step 4: Verify price
  await expect(page.locator('text=/Total: \\$[0-9]+\\.[0-9]{2}/')).toBeVisible();
  await page.click('button:has-text("Next")');
  
  // Step 5: Submit
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button:has-text("Submit Request")');
  
  // Verify confirmation
  await expect(page.locator('text=Quote submitted')).toBeVisible();
});
```

**Run**: `npm run test:e2e`

---

### RLS Security Tests (SQL)

**Coverage**: All 27 tables + new tables

**Test File**: `supabase/tests/rls_tests.sql`

**Tests**:
1. Customer can only see own data
2. Maker can see unassigned requests
3. Admin can see all data
4. Customer cannot update maker data
5. Maker cannot see other makers' earnings
6. Guest can insert print_requests (for guest checkout)
7. No user can modify user_roles directly

**Run**: `psql $DATABASE_URL -f supabase/tests/rls_tests.sql`

**Expected Output**: All tests pass (0 errors)

---

### Accessibility Audit (axe-core + Manual)

**Automated** (`tests/accessibility.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page }).analyze();
  
  expect(results.violations).toEqual([]);
});
```

**Manual Checklist**:
- [ ] Tab through all interactive elements (logical order)
- [ ] Focus indicators visible (2px teal outline)
- [ ] Screen reader announces all content (NVDA/VoiceOver)
- [ ] Color contrast ≥4.5:1 (text), ≥3:1 (interactive)
- [ ] Forms have associated labels
- [ ] Buttons have descriptive text
- [ ] Images have alt text
- [ ] Videos have captions (if applicable)
- [ ] Skip to main content link works

**Run**: `npm run test:a11y`

---

### Performance Testing (Lighthouse CI)

**Configuration** (`.lighthouserc.json`):
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:5173/",
        "http://localhost:5173/quote",
        "http://localhost:5173/dashboard"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

**Run**: `npm run lighthouse`

**Manual Performance Checks**:
- [ ] LCP <2.5s (mobile 4G)
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] Bundle size <200KB (initial JS)
- [ ] Images optimized (WebP, <100KB each)

---

### Load Testing (k6)

**Test Script** (`tests/load/quote-api.js`):
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const payload = JSON.stringify({
    materialType: 'PLA_STANDARD',
    grams: 100,
    qty: 1,
    jobSize: 'medium',
    deliverySpeed: 'standard',
    postProcessingEnabled: false,
    postProcessingTier: 'standard',
    postProcessingMinutes: 0,
    isMember: false,
  });
  
  const res = http.post('http://localhost:5173/api/quote/calculate', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time <500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

**Run**: `k6 run tests/load/quote-api.js`

**Success Criteria**:
- 95th percentile <500ms
- Error rate <1%
- 100 concurrent users supported

---

### Cross-Browser Testing

**Browsers to Test**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari (latest)
- Android Chrome (latest)

**Test Checklist** (per browser):
- [ ] Landing page renders correctly
- [ ] Quote configurator functional
- [ ] Navigation works (all roles)
- [ ] Forms submit correctly
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] Responsive at all breakpoints

**Tools**:
- BrowserStack (cloud testing)
- Playwright (automated cross-browser)
- Real devices (iOS/Android)

## Truthful UI Audit

**Checklist**:
- [ ] No buttons that do nothing
- [ ] No fake success messages
- [ ] Loading states accurate (not fake spinners)
- [ ] Error messages helpful (not generic)
- [ ] Disabled states clearly indicated
- [ ] Tooltips explain why features disabled
- [ ] No placeholder data in production
- [ ] All links functional (no 404s)

**How to Verify**:
1. Click every button → verify action occurs
2. Submit every form → verify data saved
3. Check disabled buttons → verify tooltip explains why
4. Test error states → verify helpful message shown
5. Check loading states → verify actual API call happening

## Security Audit

### OWASP Checklist

**1. Broken Access Control**:
- [ ] RLS enabled on all tables
- [ ] RLS tests pass (100% coverage)
- [ ] No privilege escalation vulnerabilities
- [ ] Admin panel only accessible to admins

**2. Cryptographic Failures**:
- [ ] Passwords hashed (Supabase default)
- [ ] Leaked password protection enabled
- [ ] HTTPS enforced (production)
- [ ] Sensitive data encrypted at rest

**3. Injection**:
- [ ] All inputs validated (Zod schemas)
- [ ] File uploads sanitized
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities

**4. Insecure Design**:
- [ ] Rate limiting on all public endpoints
- [ ] Failed login attempts logged
- [ ] RLS violations logged
- [ ] Security events monitored

**5. Security Misconfiguration**:
- [ ] Debug mode disabled (production)
- [ ] Unused dependencies removed
- [ ] `npm audit` clean (no critical/high)
- [ ] CSP headers configured

**6. Vulnerable Components**:
- [ ] `npm audit` passes
- [ ] Dependabot enabled
- [ ] Third-party libraries reviewed
- [ ] Dependencies up-to-date

**7. Authentication Failures**:
- [ ] Email verification required
- [ ] Password strength enforced (min 8 chars)
- [ ] Account lockout (Phase 2)
- [ ] Session timeout configured

**8. Software & Data Integrity**:
- [ ] File uploads validated (extension, size, MIME)
- [ ] CSP headers prevent inline scripts
- [ ] SRI for CDN assets
- [ ] Code signing (Phase 2)

**9. Logging & Monitoring**:
- [ ] All API requests logged
- [ ] Failed logins logged
- [ ] RLS violations logged
- [ ] Alerts configured (Sentry)

**10. SSRF**:
- [ ] URLs validated in file upload
- [ ] Allowed domains whitelisted
- [ ] Supabase Storage used (no external URLs)

**Run**: Manual checklist + `npm audit`

## Release Go/No-Go Checklist

### Code Quality
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code reviewed and approved
- [ ] No console errors/warnings
- [ ] No TypeScript errors
- [ ] ESLint clean

### Performance
- [ ] Lighthouse ≥90 all pages
- [ ] LCP <2.5s (mobile)
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] Bundle size <200KB

### Accessibility
- [ ] Zero axe-core violations
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast ≥4.5:1
- [ ] WCAG 2.1 AA compliant

### Security
- [ ] RLS tests pass (100%)
- [ ] `npm audit` clean
- [ ] Rate limiting works
- [ ] File upload sanitized
- [ ] OWASP checklist complete

### Functionality
- [ ] Quote flow <10s
- [ ] All pages functional
- [ ] Forms submit correctly
- [ ] Navigation works (all roles)
- [ ] Rewards system functional

### Cross-Browser
- [ ] Chrome tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] Edge tested
- [ ] Mobile tested (iOS/Android)

### SEO
- [ ] Meta tags present (all pages)
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Structured data added
- [ ] Lighthouse SEO ≥90

### Deployment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Staging tested
- [ ] Rollback plan documented
- [ ] Monitoring configured

**Decision**: GO if all checkboxes checked, NO-GO if any critical item unchecked

## Definition of Done

Phase 1 QA is complete when:
- [ ] All 6 gates passed
- [ ] All tests passing (unit, integration, E2E, RLS, accessibility, performance)
- [ ] Lighthouse ≥90 all pages
- [ ] Zero accessibility violations
- [ ] Zero RLS violations
- [ ] Cross-browser tested (6 browsers)
- [ ] Load tested (100+ users)
- [ ] Security audit passed
- [ ] Truthful UI audit passed
- [ ] Release go/no-go checklist complete

## Verification

**How this is verified**:
- Automated CI/CD pipeline (GitHub Actions)
- Lighthouse CI on every PR
- axe-core automated tests
- RLS SQL test suite
- Manual QA checklist
- Stakeholder approval

**What would block production**:
- Any gate failure
- Lighthouse <85
- Any WCAG AA violation
- Any RLS test failure
- Any critical security vulnerability
- Cross-browser critical bug
- Load test failure (>1% error rate)
