# CHECKPOINT 1: Legal Copy Draft - Rationale Notes

**Date:** 2026-01-08 11:45 AST  
**Status:** AWAITING APPROVAL

---

## What Was Created

### 1. PrintResponsibility.tsx (/print-responsibility)

**Purpose:** Critical legal page establishing the distinction between STL sales and print-as-service.

**Key Legal Points:**
- **Two distinct services:** STL Store (digital products) vs Print-as-Service (manufacturing)
- **Print shop analogy:** "Like using a friend's printer or a local print shop"
- **User responsibility clearly stated:** Users confirm rights before upload
- **Anti-piracy position explicit:** "We do not enable piracy"
- **14-day file retention** with immediate deletion on request
- **Designer opt-out program** with clear contact channels

**Why This Matters:**
A Canadian IP lawyer reviewing this page should conclude that 3D3D:
- Does not induce infringement
- Operates two legally distinct activities
- Acts in good faith with reasonable safeguards

---

### 2. TermsOfService.tsx Updates

**Section 2: Digital Products & Manufacturing Services** (NEW)
- Explicit separation of STL sales vs print services
- Clear statement: "These are legally distinct activities"
- User warranty: "you have the legal right to have it manufactured"

**Section 5: Intellectual Property** (UPDATED)
- 14-day file retention stated
- "We do not acquire any license to your uploaded files"
- STL Store content clearly distinguished

**Section 6: Limitations & Disclaimers** (UPDATED)
- Separate liability for Print Services vs STL Sales
- "We are not liable for infringement claims arising from files you upload"
- 3D3D warrants STL Store files are properly licensed

**Section 7: Governing Law & Jurisdiction** (NEW)
- New Brunswick jurisdiction explicit
- Federal laws of Canada applicable

**Why This Matters:**
These updates establish the legal framework that protects 3D3D from secondary liability for user-uploaded content while taking responsibility for content we sell.

---

### 3. PrivacyPolicy.tsx Updates

**Section 1: Information We Collect** (UPDATED)
- CASL consent records now listed
- Uploaded files explicitly mentioned (with "NOT retained permanently" note)

**Section 6: Email Marketing (CASL Compliance)** (NEW)
- Explicit CASL compliance statement
- Checkbox unchecked by default
- Timestamp and IP logging documented
- Clear statement: "We will NEVER pre-check the consent checkbox"

**Section 7: File Retention & Deletion** (NEW)
- 14-day maximum retention
- Immediate deletion on request
- Clear list of what we keep vs delete
- "We NEVER sell or share your uploaded files"

**Section 8: Data Retention & Location** (UPDATED)
- Supabase Canada Central storage specified
- CASL consent records: permanent (legal requirement)
- Uploaded files: 14 days max

**Section 9: Designer Opt-Out Records** (NEW)
- What we store for designers who opt out
- Why we store it
- Rights to update/remove

**Why This Matters:**
PIPEDA requires transparency about data handling. CASL requires documented consent. These sections provide both.

---

## Legal Risk Assessment

| Area | Risk Level | Mitigation |
|------|------------|------------|
| IP Infringement | Medium | Clear user responsibility, opt-out program |
| CASL Violation | Low | Explicit consent, timestamp logging |
| PIPEDA Violation | Low | Transparent retention, deletion rights |
| Liability Confusion | Medium → Low | Clear service separation in ToS |

---

## Language Validation

**Approved phrases used:**
- ✅ "Buy models we've designed or licensed"
- ✅ "Print your own designs with our printers"
- ✅ "Like using a friend's printer"
- ✅ "We do not enable piracy"
- ✅ "14 days maximum"

**Forbidden phrases avoided:**
- ❌ "Marketplace of user models" (not used)
- ❌ "We sell community designs" (replaced with licensed/owned)
- ❌ Vague liability language (replaced with specific)

---

## Files Changed

| File | Lines Changed | Summary |
|------|--------------|---------|
| PrintResponsibility.tsx | NEW (340 lines) | Complete IP policy page |
| TermsOfService.tsx | ~60 lines | 7 sections, jurisdiction, separation |
| PrivacyPolicy.tsx | ~80 lines | 10 sections, CASL, retention |
| App.tsx | 2 lines | Import + route |

---

## Build Status

```
✓ 2534 modules transformed
✓ built in 9.28s
Exit code: 0
```

---

## Approval Requested

Please review:
1. /print-responsibility content
2. Terms of Service changes
3. Privacy Policy changes

Confirm if this checkpoint is approved before I proceed to Checkpoint 2 (UX Enforcement).
