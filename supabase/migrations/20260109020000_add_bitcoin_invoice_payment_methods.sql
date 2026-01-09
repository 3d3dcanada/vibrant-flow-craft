-- Migration: Update payment methods for Phase 3C.2
-- Date: 2026-01-09
-- Purpose: Remove card/Stripe and add Bitcoin, Invoice payment methods

-- Add new payment method values to the enum
-- Note: We cannot easily remove values from PostgreSQL enums, so we add the new ones
-- and the old values will be deprecated (stripe, etransfer)

DO $$ BEGIN
    ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'bitcoin';
    ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'invoice';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Note: 'stripe' and 'etransfer' remain in the enum for backwards compatibility
-- with any existing orders, but are no longer used in new orders.
-- The UI only shows: bitcoin, invoice, credits

-- Add comment documenting the deprecation
COMMENT ON TYPE public.payment_method IS 
    'Payment methods: bitcoin, invoice, credits are active. 
    stripe and etransfer are deprecated and not shown in UI.';
