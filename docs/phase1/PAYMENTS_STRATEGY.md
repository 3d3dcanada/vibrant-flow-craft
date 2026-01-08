# 3D3D.ca — Phase 1 Payments Strategy

**Classification:** INTERNAL — FOR LAWYER & PROCESSOR REVIEW  
**Version:** v1.0  
**Date:** January 8, 2026  
**Status:** Phase 1 (Pre-Launch)  

---

## 1. Executive Summary

This document outlines the payments strategy for 3D3D Phase 1 launch. The approach prioritizes regulatory compliance, low fraud risk, and operational simplicity while payments infrastructure is being finalized.

**Key Principle:** We do not custody customer funds directly in Phase 1.

---

## 2. Phase 1 Payment Methods

### 2.1 Primary: Interac e-Transfer

- **Recipient:** payments@3d3d.ca
- **Flow:** Customer sends e-Transfer → Staff confirms → Credits issued manually
- **Delay:** 1-24 hours (manual confirmation)
- **Advantages:**
  - No processor fees
  - High trust in Canada
  - No stored payment credentials
  - Immediate bank notification

### 2.2 Secondary: Gift Card Trade Program

- **Accepted Cards:** Amazon, Steam, PlayStation, Xbox, Google Play
- **Exchange Rates:** Posted publicly, updated weekly
- **Verification:** Individual card verification via retailer API or manual check
- **Flow:** Customer provides card details → Staff verifies balance → Credits issued at posted rate

**No Direct Custody:**
- Gift card value is verified and absorbed immediately
- We do not resell or hold gift cards as assets
- Cards are redeemed or liquidated within 24-48 hours

### 2.3 Future: Credit/Debit Card Processing

- Target: Phase 2
- Provider evaluation in progress (Stripe, Square, Moneris)
- Will require PCI-DSS compliance review
- Not active in Phase 1

---

## 3. Platform Credits System

### 3.1 Definition

- 1 Credit = $0.10 CAD equivalent (10 credits = $1)
- Credits are a **platform balance**, not currency
- Credits represent prepaid service value

### 3.2 Legal Classification

Credits are NOT:
- Legal tender
- Cryptocurrency or digital currency
- Stored value instruments requiring money transmitter licensing*
- Refundable for cash (except where legally required)

*Note: Credits are redeemable only for services, not transferable, and non-convertible — likely exempting from MSB registration. Legal counsel confirmation recommended.

### 3.3 Regulatory Position

- Credits function as "prepaid service credits" similar to restaurant gift cards
- No interest earned on credit balances
- No marketplace or P2P transfer functionality
- No conversion to cash
- No cross-border transfer

### 3.4 Expiration

- Phase 1: Credits do not expire
- Future: May implement 24-month inactivity expiry with notice (subject to provincial consumer protection laws)

---

## 4. What We Do NOT Do

| Activity | Status | Reason |
|----------|--------|--------|
| Store credit card numbers | ❌ No | PCI-DSS compliance burden |
| Hold customer funds in trust | ❌ No | Avoids custody requirements |
| Offer cash refunds | ❌ No* | Credits only (except legal requirement) |
| Transfer credits between users | ❌ No | Avoids P2P/money transmission |
| Allow credit withdrawal | ❌ No | Not a bank account |
| Offer loans or financing | ❌ No | Financial services regulation |

*Exception: Provincial consumer protection laws may require cash refunds in certain circumstances.

---

## 5. Anti-Money Laundering Considerations

### 5.1 Transaction Limits

- Single transaction limit: $500 CAD
- Daily limit per user: $500 CAD
- Monthly limit per user: $2,000 CAD

Transactions above these limits require manual review.

### 5.2 Know Your Customer (KYC)

Phase 1 (minimal):
- Email verification required
- Transaction history logged
- Suspicious pattern monitoring (manual)

Phase 2 (enhanced):
- ID verification for high-value transactions
- Automated suspicious activity detection

### 5.3 Record Retention

- All transaction records retained for 7 years (Canadian AML requirement)
- Records include: date, amount, user ID, method, IP address

---

## 6. Refund Policy

### 6.1 Print Orders

- Quality issues: Full credit refund or reprint
- Customer error (wrong file, size, etc.): No refund
- Shipping damage: Full credit refund + replacement

### 6.2 Credit Purchases

- e-Transfer: Non-refundable (credits already issued)
- Gift card trades: Non-refundable (card already redeemed)
- Future card payments: Subject to processor dispute process

### 6.3 Provincial Requirements

Some provinces may require cash refund option for prepaid credits. Legal review recommended for:
- Quebec (Consumer Protection Act)
- Ontario (Consumer Protection Act)

---

## 7. UI Disclosure Requirements

All payment-related pages must display:

"Payments are not yet fully active. Credits are platform balance only, non-refundable except where legally required, and cannot be exchanged for cash."

Locations requiring this disclosure:
- Landing page (banner)
- Quote configurator
- Credits store
- Checkout flow

---

## 8. Third-Party Gift Card Processors

### 8.1 Current Approach

Manual verification and liquidation

### 8.2 Evaluated Providers

| Provider | Status | Notes |
|----------|--------|-------|
| CardCash (API) | Evaluation | Bulk liquidation |
| Raise (API) | Evaluation | Exchange rate optimization |
| Direct Use | Current | Amazon purchases for supplies |

### 8.3 Compliance

- Gift card terms of service reviewed
- No fraud facilitation
- Verification of legitimate acquisition

---

## 9. Action Items for Legal Review

1. **MSB Registration:** Confirm credits system does not require Money Services Business registration with FINTRAC
2. **Provincial Prepaid Rules:** Review NB, NS, PE consumer protection laws for prepaid credit requirements
3. **Gift Card Terms:** Confirm bulk gift card trade program complies with retailer terms
4. **Refund Obligations:** Clarify cash refund requirements per province
5. **Tax Treatment:** Confirm HST treatment for non-refundable credits

---

## 10. Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | January 8, 2026 | Initial strategy document |

---

**END OF DOCUMENT**
