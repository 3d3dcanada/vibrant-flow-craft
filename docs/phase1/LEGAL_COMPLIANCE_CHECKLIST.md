# LEGAL COMPLIANCE CHECKLIST
**Date:** 2026-01-08 09:25 AST  
**Jurisdiction:** Canada (Federal + New Brunswick)

---

## PIPEDA (Personal Information Protection)

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Privacy Policy exists | PASS | PrivacyPolicy.tsx (10KB) | Review for Canada specifics |
| Data collection disclosed | PARTIAL | Generic content | Update with actual data collected |
| User consent mechanism | FAIL | No opt-in flow | Add CASL checkbox |
| Data retention policy | UNKNOWN | Need to review content | Verify or add |
| User data access rights | UNKNOWN | Need to review content | Verify or add |
| Breach notification procedure | UNKNOWN | Need to review content | Add if missing |

**Overall PIPEDA Status:** PARTIAL PASS (needs review + updates)

---

## CASL (Canadian Anti-Spam Legislation)

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Express consent checkbox | FAIL | Not implemented | BUILD (P0-3) |
| Consent is opt-in (unchecked default) | N/A | Not built yet | Ensure when building |
| Consent timestamp logging | FAIL | No DB column | Add migration |
| Consent IP address logging | FAIL | No DB column | Add migration |
| Unsubscribe mechanism | UNKNOWN | No email system yet | Document for future |
| Clear identification (sender) | N/A | No emails sent yet | N/A |
| Purpose of communication stated | FAIL | No consent text yet | Add in component |

**Overall CASL Status:** FAIL (blocking launch)

**Blocker:** Must implement before public launch

---

## CONSUMER PROTECTION

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Clear pricing disclosure | PARTIAL | QuoteConfigurator shows price | Add "Not final" disclaimer |
| "Payments not live" disclosure | FAIL | Not visible | ADD (P0-4) |
| Refund policy exists | PASS | /refunds page exists | Review for Canada |
| Terms of Service exists | PASS | TermsOfService.tsx (8.8KB) | Review jurisdiction clause |
| Canadian jurisdiction stated | UNKNOWN | Need to review ToS | Verify or add |
| No misleading claims | UNKNOWN | Need full audit | Verify brand-voice pages |

**Overall Consumer Protection Status:** PARTIAL PASS

---

## ACCESSIBILITY (WCAG 2.1 AA)

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Contrast ratio minimum (4.5:1) | UNKNOWN | Not audited | RUN axe-core (P1-6) |
| Keyboard navigation | PARTIAL | Basic HTML works | Test complex components |
| Alt text on images | UNKNOWN | Not audited | Audit images |
| Form labels | LIKELY PASS | React components | Verify |
| Focus indicators | PARTIAL | Browser default | May need enhancement |
| Screen reader compatibility | UNKNOWN | Not tested | Test with NVDA/JAWS |

**Overall Accessibility Status:** UNKNOWN (audit required)

**Blocker:** Should audit before launch

---

## DATA RESIDENCY & SOVEREIGNTY

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Database hosted in Canada | PASS | Supabase Canada (Central) | None |
| User data stays in Canada | LIKELY PASS | Supabase region locked | Verify Edge Function regions |
| Third-party processors disclosed | PARTIAL | Supabase mentioned | Document all processors |

**Overall Data Residency Status:** PASS

---

## QUEBEC-SPECIFIC (If applicable)

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| French language option | FAIL | English only | Phase 2 (not blocker for NB launch) |
| Law 25 compliance | UNKNOWN | Not evaluated | Evaluate if targeting QC |

**Overall Quebec Status:** NOT APPLICABLE (Fredericton-first launch)

**Note:** If expanding to Quebec, Law 25 compliance required

---

## SUMMARY

### PASS
- Database in Canada
- Privacy Policy exists
- Terms of Service exists
- Refund policy exists

### FAIL (BLOCKING)
- **CASL compliance** (P0-3)
- **"No payments" disclosure** (P0-4)

### NEEDS REVIEW
- Privacy Policy (Canada specifics)
- Terms of Service (jurisdiction clause)
- Consumer protection claims
- Accessibility (axe-core audit)

### RECOMMENDED
- Accessibility audit before launch
- Legal review of ToS/Privacy by Canadian lawyer
- Full content audit for misleading claims

---

## GO/NO-GO FOR LAUNCH

**MUST FIX (Blocking):**
- [ ] CASL checkbox + timestamp logging
- [ ] "No payments" disclosure on 3+ pages

**SHOULD FIX (Highly recommended):**
- [ ] Privacy Policy review for PIPEDA
- [ ] Terms of Service review for jurisdiction
- [ ] Accessibility audit (WCAG 2.1 AA critical items)

**CAN DEFER (Post-launch):**
- [ ] Full accessibility compliance
- [ ] Professional legal review
- [ ] French language support (if not targeting QC)

**Launch-ready if:** 2/2 MUST FIX + 2/3 SHOULD FIX complete
