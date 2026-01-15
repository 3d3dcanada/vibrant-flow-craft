# Phase 3H Visibility Patch — Fulfillment Visibility

## What changed
- Added Track links and clearer status labels in the Customer Dashboard order list, plus a primary “Get a Quote” CTA for empty orders.
- Added a “Back to My Orders” link and a fallback fulfillment message on Order Confirmation when fulfillment data is still loading or missing.
- Clarified maker shipment fields as required when marking shipments and added a helper note about customer visibility.
- Added a maker assignment/shipment status badge in Admin Payments rows.

## Why
Customers need an obvious, fast path to track orders, while operators need clearer shipment signals and accurate required fields. These changes improve visibility without altering backend contracts.

## Manual verification click-path
- Customer: Dashboard → My Orders → Track → OrderConfirmation timeline visible, no maker identity.
- Maker: Maker Jobs → Mark shipped → tracking fields required, helper note visible.
- Admin: Payments → rows show maker assignment/shipment status badge (or Unassigned).
