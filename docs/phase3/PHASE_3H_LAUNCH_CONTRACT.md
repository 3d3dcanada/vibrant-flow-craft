# Phase 3H Launch Contract

**Status:** Active (Launch Freeze)

This document is the authority of record for Phase 3H. It defines the immutable behaviors, guardrails, and approval requirements that lock launch readiness.

## Immutable behaviors (MUST NOT change)

- **Fulfillment assignment flow**
  - Admin assignment RPC (`admin_assign_order_to_maker`) and maker status update RPC (`maker_update_order_status`) must preserve their inputs, outputs, status transitions, audit logging, and authorization checks.
- **Customer fulfillment payload**
  - Customer-facing RPC (`customer_get_order_fulfillment`) must keep its response shape, data restrictions (no maker identity), and tracking/status history structure unchanged.
- **Earnings and payouts**
  - Maker earnings ledger creation and payout status semantics must remain stable and consistent with Phase 3F definitions.
- **Order status alignment**
  - Order status synchronization between maker updates and customer views must not be altered.

## Guardrails that enforce compliance

- **Launch-frozen markers** are present in fulfillment RPC SQL files and fulfillment UI components. These markers signal freeze scope and act as review tripwires.
- **Operator gate history** remains closed and documented (Phases 3G and earlier).
- **No behavior changes** to SQL, RPC, or UI logic are permitted under Phase 3H.

## What constitutes a breaking change

- Any modification to fulfillment RPC inputs/outputs, response schemas, or error messages.
- Any change to role authorization or RLS enforcement for admin/maker/customer flows.
- Any change to order status transitions, status history structure, or tracking data constraints.
- Any change to maker earnings calculation, ledger creation timing, or payout status rules.
- Any change to customer payload content, including removal or addition of fields in fulfillment responses.

## Post-launch change approvals

Post-launch changes to fulfillment, earnings, assignment, or customer payloads require **all** of the following approvals:

- **Product Owner**
- **Engineering Lead**
- **Security/Compliance Owner**

Any approved change must be executed under a new phase with updated documentation, validation, and explicit sign-off.
