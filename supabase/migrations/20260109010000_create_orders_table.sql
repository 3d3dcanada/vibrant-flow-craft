-- Migration: Create orders table for Phase 3C checkout
-- Date: 2026-01-09
-- Purpose: Store orders created from quotes with payment status tracking

-- Order status enum
DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM (
        'pending_payment',
        'awaiting_payment',
        'paid',
        'in_production',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment method enum
DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM (
        'stripe',
        'etransfer',
        'credits'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
    
    -- Order number for display (human-readable)
    order_number TEXT UNIQUE NOT NULL,
    
    -- Quote snapshot (stored at time of order for immutability)
    quote_snapshot JSONB NOT NULL,
    
    -- Pricing (locked at order time)
    total_cad DECIMAL(10,2) NOT NULL CHECK (total_cad >= 0),
    currency TEXT NOT NULL DEFAULT 'CAD',
    
    -- Payment
    payment_method public.payment_method NOT NULL,
    stripe_checkout_session_id TEXT,
    stripe_payment_intent_id TEXT,
    payment_confirmed_at TIMESTAMP WITH TIME ZONE,
    
    -- Shipping address snapshot
    shipping_address JSONB NOT NULL,
    
    -- Status tracking
    status public.order_status NOT NULL DEFAULT 'pending_payment',
    status_history JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_quote_id ON public.orders(quote_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON public.orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders (limited - mainly for cancellation)
CREATE POLICY "Users can update own orders"
    ON public.orders
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
    ON public.orders
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Admins can update all orders
CREATE POLICY "Admins can update all orders"
    ON public.orders
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_orders_update
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_orders_updated_at();

-- Function to generate order numbers (3D-YYYYMMDD-XXXX format)
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    date_part TEXT;
    sequence_part TEXT;
    new_order_number TEXT;
BEGIN
    date_part := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Get the next sequence number for today
    SELECT LPAD(
        COALESCE(
            (SELECT COUNT(*) + 1 
             FROM public.orders 
             WHERE order_number LIKE '3D-' || date_part || '-%'),
            1
        )::TEXT, 
        4, 
        '0'
    ) INTO sequence_part;
    
    new_order_number := '3D-' || date_part || '-' || sequence_part;
    RETURN new_order_number;
END;
$$;
