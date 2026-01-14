-- Phase 3F: Maker Fulfillment Flow (CORRECTED)
-- Date: 2026-01-13
-- Purpose: Create maker profiles, order assignments, and earnings tracking
-- COMPLIANCE: Matches authoritative Phase 3F spec exactly
-- ================================================
-- 3F.1: MAKER DATA MODEL
-- ================================================
-- A) Maker Profiles Table
CREATE TABLE IF NOT EXISTS public.maker_profiles (
    maker_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    location TEXT,
    printers JSONB DEFAULT '{}'::jsonb,
    materials_supported TEXT [] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    postal_prefix TEXT CHECK (
        postal_prefix IS NULL
        OR LENGTH(postal_prefix) = 3
    ),
    -- First 3 chars of postal code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
-- B) Maker Orders Table (CORRECTED: was maker_assignments)
-- This tracks which maker is assigned to which order
CREATE TABLE IF NOT EXISTS public.maker_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
    -- One maker per order
    maker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (
        status IN (
            'assigned',
            'in_production',
            'shipped',
            'completed'
        )
    ),
    tracking_info JSONB DEFAULT '{}'::jsonb,
    -- { carrier, tracking_number, shipped_at, etc. }
    notes TEXT,
    -- Admin notes and maker notes combined
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
-- C) Maker Earnings Table (ledger per fulfilled order)
CREATE TABLE IF NOT EXISTS public.maker_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
    -- One earnings record per order
    gross_amount_cad DECIMAL(10, 2) NOT NULL CHECK (gross_amount_cad >= 0),
    platform_fee_cad DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (platform_fee_cad >= 0),
    payout_amount_cad DECIMAL(10, 2) NOT NULL CHECK (payout_amount_cad >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_maker_orders_order_id ON public.maker_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_maker_orders_maker_id ON public.maker_orders(maker_id);
CREATE INDEX IF NOT EXISTS idx_maker_orders_status ON public.maker_orders(status);
CREATE INDEX IF NOT EXISTS idx_maker_earnings_maker_id ON public.maker_earnings(maker_id);
CREATE INDEX IF NOT EXISTS idx_maker_earnings_status ON public.maker_earnings(status);
CREATE INDEX IF NOT EXISTS idx_maker_earnings_order_id ON public.maker_earnings(order_id);
-- Enable RLS
ALTER TABLE public.maker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maker_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maker_earnings ENABLE ROW LEVEL SECURITY;
-- ================================================
-- RLS POLICIES
-- ================================================
-- Maker Profiles Policies
CREATE POLICY "Makers can view own profile" ON public.maker_profiles FOR
SELECT USING (maker_id = auth.uid());
CREATE POLICY "Makers can update own profile" ON public.maker_profiles FOR
UPDATE USING (maker_id = auth.uid());
CREATE POLICY "Admins can view all maker profiles" ON public.maker_profiles FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can insert maker profiles" ON public.maker_profiles FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can update all maker profiles" ON public.maker_profiles FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
-- Maker Orders Policies
CREATE POLICY "Makers can view own assigned orders" ON public.maker_orders FOR
SELECT USING (maker_id = auth.uid());
CREATE POLICY "Makers can update own assigned orders" ON public.maker_orders FOR
UPDATE USING (maker_id = auth.uid());
CREATE POLICY "Admins can view all maker orders" ON public.maker_orders FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can insert maker orders" ON public.maker_orders FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can update all maker orders" ON public.maker_orders FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
-- Maker Earnings Policies
CREATE POLICY "Makers can view own earnings" ON public.maker_earnings FOR
SELECT USING (maker_id = auth.uid());
CREATE POLICY "Admins can view all earnings" ON public.maker_earnings FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can insert earnings" ON public.maker_earnings FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can update earnings" ON public.maker_earnings FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = auth.uid()
                AND role = 'admin'
        )
    );
-- Extend orders RLS to allow makers to view assigned orders
CREATE POLICY "Makers can view assigned orders" ON public.orders FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.maker_orders
            WHERE maker_orders.order_id = orders.id
                AND maker_orders.maker_id = auth.uid()
        )
    );
-- ================================================
-- TRIGGERS
-- ================================================
-- Trigger for maker_profiles updated_at
CREATE OR REPLACE FUNCTION public.update_maker_profiles_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$;
CREATE TRIGGER on_maker_profiles_update BEFORE
UPDATE ON public.maker_profiles FOR EACH ROW EXECUTE FUNCTION public.update_maker_profiles_updated_at();
-- Trigger for maker_orders updated_at
CREATE OR REPLACE FUNCTION public.update_maker_orders_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$;
CREATE TRIGGER on_maker_orders_update BEFORE
UPDATE ON public.maker_orders FOR EACH ROW EXECUTE FUNCTION public.update_maker_orders_updated_at();
-- ==================================================
-- 3F.2: ADMIN ASSIGN ORDER TO MAKER RPC (CORRECTED)
-- ==================================================
CREATE OR REPLACE FUNCTION public.admin_assign_order_to_maker(
        p_order_id UUID,
        p_maker_id UUID,
        p_reason TEXT
    ) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE v_admin_id UUID;
v_order RECORD;
v_maker RECORD;
v_maker_order_id UUID;
BEGIN -- Verify admin
v_admin_id := auth.uid();
IF NOT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = v_admin_id
        AND role = 'admin'
) THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Admin access required'
);
END IF;
-- Validate order exists and is paid
SELECT * INTO v_order
FROM orders
WHERE id = p_order_id FOR
UPDATE;
IF NOT FOUND THEN RETURN json_build_object('success', false, 'error', 'Order not found');
END IF;
IF v_order.status != 'paid' THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Order must be paid before assignment'
);
END IF;
-- Validate maker exists and has maker role
IF NOT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = p_maker_id
        AND role = 'maker'
) THEN RETURN json_build_object('success', false, 'error', 'User is not a maker');
END IF;
-- Validate maker profile exists and is active
SELECT * INTO v_maker
FROM maker_profiles
WHERE maker_id = p_maker_id;
IF NOT FOUND THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Maker profile not found'
);
END IF;
IF NOT v_maker.active THEN RETURN json_build_object('success', false, 'error', 'Maker is not active');
END IF;
-- Upsert maker_orders (allows reassignment)
INSERT INTO maker_orders (
        order_id,
        maker_id,
        status,
        notes
    )
VALUES (
        p_order_id,
        p_maker_id,
        'assigned',
        'Admin reason: ' || p_reason
    ) ON CONFLICT (order_id) DO
UPDATE
SET maker_id = p_maker_id,
    status = 'assigned',
    assigned_at = now(),
    notes = 'Reassigned by admin. Reason: ' || p_reason,
    updated_at = now()
RETURNING id INTO v_maker_order_id;
-- Create earnings record at assignment (per spec option)
-- Using 70% payout as default (can be configured later)
INSERT INTO maker_earnings (
        maker_id,
        order_id,
        gross_amount_cad,
        platform_fee_cad,
        payout_amount_cad,
        status
    )
VALUES (
        p_maker_id,
        p_order_id,
        v_order.total_cad,
        (v_order.total_cad * 0.30),
        (v_order.total_cad * 0.70),
        'pending'
    ) ON CONFLICT (order_id) DO
UPDATE
SET maker_id = p_maker_id,
    gross_amount_cad = v_order.total_cad,
    platform_fee_cad = (v_order.total_cad * 0.30),
    payout_amount_cad = (v_order.total_cad * 0.70);
-- Update order status to in_production
UPDATE orders
SET status = 'in_production'::order_status
WHERE id = p_order_id;
-- Log to audit
INSERT INTO admin_audit_log (
        admin_id,
        action_type,
        target_type,
        target_id,
        before_state,
        after_state,
        reason
    )
VALUES (
        v_admin_id,
        'order_assignment',
        'maker_order',
        v_maker_order_id,
        jsonb_build_object('order_id', p_order_id, 'previous_maker', NULL),
        jsonb_build_object(
            'order_id',
            p_order_id,
            'maker_id',
            p_maker_id,
            'status',
            'assigned'
        ),
        p_reason
    );
RETURN json_build_object(
    'success',
    true,
    'maker_order_id',
    v_maker_order_id,
    'order_id',
    p_order_id,
    'maker_id',
    p_maker_id,
    'message',
    'Order assigned to maker successfully'
);
END;
$$;
-- ==================================================
-- 3F.4: MAKER UPDATE ORDER STATUS RPC (AUDIT-SAFE)
-- ==================================================
CREATE OR REPLACE FUNCTION public.maker_update_order_status(
        p_order_id UUID,
        p_new_status TEXT,
        p_notes TEXT,
        p_tracking_number TEXT DEFAULT NULL,
        p_carrier TEXT DEFAULT NULL
    ) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE v_maker_id UUID;
v_maker_order RECORD;
v_order RECORD;
v_old_status TEXT;
v_status_history JSONB;
v_tracking_info JSONB;
BEGIN -- Verify maker
v_maker_id := auth.uid();
IF NOT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = v_maker_id
        AND role = 'maker'
) THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Maker access required'
);
END IF;
-- Get maker_order and verify maker is assigned
SELECT * INTO v_maker_order
FROM maker_orders
WHERE order_id = p_order_id FOR
UPDATE;
IF NOT FOUND THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Order not assigned to you'
);
END IF;
IF v_maker_order.maker_id != v_maker_id THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Order not assigned to you'
);
END IF;
-- Get current order state
SELECT * INTO v_order
FROM orders
WHERE id = p_order_id FOR
UPDATE;
IF NOT FOUND THEN RETURN json_build_object('success', false, 'error', 'Order not found');
END IF;
v_old_status := v_maker_order.status;
-- Validate status transitions (assigned → in_production → shipped)
IF v_old_status = 'assigned'
AND p_new_status NOT IN ('in_production') THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Can only move to in_production from assigned'
);
END IF;
IF v_old_status = 'in_production'
AND p_new_status NOT IN ('shipped') THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Can only move to shipped from in_production'
);
END IF;
IF v_old_status = 'shipped' THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Cannot update status after shipped. Admin must mark as delivered.'
);
END IF;
-- AUDIT-SAFE: Validate shipping data if transitioning to shipped
IF p_new_status = 'shipped' THEN IF p_tracking_number IS NULL
OR trim(p_tracking_number) = '' THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Tracking number is required when marking as shipped'
);
END IF;
IF p_carrier IS NULL
OR trim(p_carrier) = '' THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Shipping carrier is required when marking as shipped'
);
END IF;
-- Build tracking_info JSONB with explicit server-side timestamp
v_tracking_info := jsonb_build_object(
    'tracking_number',
    trim(p_tracking_number),
    'carrier',
    trim(p_carrier),
    'shipped_at',
    NOW()
);
ELSE -- For non-shipped statuses, tracking fields must be NULL
IF p_tracking_number IS NOT NULL
OR p_carrier IS NOT NULL THEN RETURN json_build_object(
    'success',
    false,
    'error',
    'Tracking information can only be provided when marking as shipped'
);
END IF;
v_tracking_info := '{}'::jsonb;
END IF;
-- Update maker_orders status and tracking_info
UPDATE maker_orders
SET status = p_new_status,
    notes = COALESCE(notes || E'\n\n' || p_notes, p_notes),
    tracking_info = v_tracking_info,
    updated_at = NOW()
WHERE order_id = p_order_id;
-- Build status history entry for main orders table
v_status_history := COALESCE(v_order.status_history, '[]'::jsonb);
v_status_history := v_status_history || jsonb_build_object(
    'from',
    v_old_status,
    'to',
    p_new_status,
    'reason',
    p_notes,
    'changed_by',
    v_maker_id,
    'changed_by_role',
    'maker',
    'changed_at',
    NOW()
);
-- Update main orders table status to sync with maker status
-- Map maker statuses to order statuses
UPDATE orders
SET status = CASE
        WHEN p_new_status = 'in_production' THEN 'in_production'::order_status
        WHEN p_new_status = 'shipped' THEN 'shipped'::order_status
        ELSE status
    END,
    status_history = v_status_history,
    notes = COALESCE(
        notes || E'\n\n[Maker] ' || p_notes,
        '[Maker] ' || p_notes
    ),
    updated_at = NOW()
WHERE id = p_order_id;
-- Log maker action to audit with full tracking snapshot
INSERT INTO admin_audit_log (
        admin_id,
        action_type,
        target_type,
        target_id,
        before_state,
        after_state,
        reason
    )
VALUES (
        v_maker_id,
        'maker_status_update',
        'maker_order',
        v_maker_order.id,
        jsonb_build_object('status', v_old_status),
        jsonb_build_object(
            'status',
            p_new_status,
            'tracking_info',
            v_tracking_info
        ),
        p_notes
    );
RETURN json_build_object(
    'success',
    true,
    'order_id',
    p_order_id,
    'old_status',
    v_old_status,
    'new_status',
    p_new_status,
    'message',
    'Order status updated successfully'
);
END;
$$;
-- ==================================================
-- GRANT PERMISSIONS
-- ==================================================
GRANT EXECUTE ON FUNCTION public.admin_assign_order_to_maker(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.maker_update_order_status(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
-- ==================================================
-- COMMENTS
-- ==================================================
COMMENT ON TABLE public.maker_profiles IS 'Profiles for makers in the 3D3D platform';
COMMENT ON TABLE public.maker_orders IS 'Tracks which maker is assigned to which order and status';
COMMENT ON TABLE public.maker_earnings IS 'Earnings ledger for makers per fulfilled order';
COMMENT ON FUNCTION public.admin_assign_order_to_maker IS 'Admin-only function to assign paid orders to makers. Creates earnings at assignment.';
COMMENT ON FUNCTION public.maker_update_order_status IS 'Maker-only function to update order status: assigned→in_production→shipped';