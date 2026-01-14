-- Phase 3F Launch Hardening
-- Date: 2026-01-13
-- Purpose: Close audit and governance gaps for maker fulfillment

-- 1) RLS: enforce RPC-only writes for makers on maker_orders
DROP POLICY IF EXISTS "Makers can update own assigned orders" ON public.maker_orders;

-- 2) Earnings ledger immutability + audit before-state
CREATE OR REPLACE FUNCTION public.admin_assign_order_to_maker(
    p_order_id UUID,
    p_maker_id UUID,
    p_reason TEXT
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID;
    v_order RECORD;
    v_maker RECORD;
    v_maker_order_id UUID;
    v_existing_maker_order RECORD;
BEGIN
    -- Verify admin
    v_admin_id := auth.uid();
    IF NOT EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = v_admin_id
          AND role = 'admin'
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Admin access required'
        );
    END IF;

    -- Validate order exists and is paid
    SELECT * INTO v_order
    FROM orders
    WHERE id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Order not found');
    END IF;

    IF v_order.status != 'paid' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Order must be paid before assignment'
        );
    END IF;

    -- Validate maker exists and has maker role
    IF NOT EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = p_maker_id
          AND role = 'maker'
    ) THEN
        RETURN json_build_object('success', false, 'error', 'User is not a maker');
    END IF;

    -- Validate maker profile exists and is active
    SELECT * INTO v_maker
    FROM maker_profiles
    WHERE maker_id = p_maker_id;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Maker profile not found'
        );
    END IF;

    IF NOT v_maker.active THEN
        RETURN json_build_object('success', false, 'error', 'Maker is not active');
    END IF;

    -- Capture existing maker order (if any) for audit
    SELECT * INTO v_existing_maker_order
    FROM maker_orders
    WHERE order_id = p_order_id;

    -- Earnings ledger is immutable once created
    IF EXISTS (
        SELECT 1
        FROM maker_earnings
        WHERE order_id = p_order_id
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Order cannot be reassigned after earnings creation'
        );
    END IF;

    -- Upsert maker_orders (allows assignment)
    INSERT INTO maker_orders (
        order_id,
        maker_id,
        status,
        notes,
        assigned_at
    ) VALUES (
        p_order_id,
        p_maker_id,
        'assigned',
        'Admin reason: ' || COALESCE(p_reason, ''),
        now()
    ) ON CONFLICT (order_id) DO UPDATE
    SET maker_id = p_maker_id,
        status = 'assigned',
        assigned_at = now(),
        notes = 'Reassigned by admin. Reason: ' || COALESCE(p_reason, ''),
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
    ) VALUES (
        p_maker_id,
        p_order_id,
        v_order.total_cad,
        (v_order.total_cad * 0.30),
        (v_order.total_cad * 0.70),
        'pending'
    )
    ON CONFLICT (order_id) DO NOTHING;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Order cannot be reassigned after earnings creation'
        );
    END IF;

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
    ) VALUES (
        v_admin_id,
        'order_assignment',
        'maker_order',
        v_maker_order_id,
        CASE
            WHEN v_existing_maker_order.id IS NULL THEN
                jsonb_build_object('order_id', p_order_id, 'previous_maker', NULL)
            ELSE
                jsonb_build_object(
                    'order_id', p_order_id,
                    'previous_maker', v_existing_maker_order.maker_id,
                    'previous_status', v_existing_maker_order.status
                )
        END,
        jsonb_build_object(
            'order_id', p_order_id,
            'maker_id', p_maker_id,
            'status', 'assigned'
        ),
        p_reason
    );

    RETURN json_build_object(
        'success', true,
        'maker_order_id', v_maker_order_id,
        'order_id', p_order_id,
        'maker_id', p_maker_id,
        'message', 'Order assigned to maker successfully'
    );
END;
$$;

-- 3) Single source of truth: prevent delivered unless shipped by maker
CREATE OR REPLACE FUNCTION public.admin_update_order_status(
    p_order_id UUID,
    p_new_status TEXT,
    p_reason TEXT DEFAULT NULL,
    p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID;
    v_order RECORD;
    v_old_status TEXT;
    v_status_history JSONB;
    v_maker_status TEXT;
BEGIN
    -- Verify admin
    v_admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_admin_id AND role = 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;

    -- Validate status input before casting
    IF p_new_status NOT IN (
        SELECT unnest(enum_range(NULL::order_status))::text
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid order status: ' || p_new_status
        );
    END IF;

    -- Get current order state
    SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Order not found');
    END IF;

    -- Enforce delivered only if maker has shipped
    IF p_new_status = 'delivered' THEN
        SELECT status INTO v_maker_status
        FROM maker_orders
        WHERE order_id = p_order_id;

        IF v_maker_status IS DISTINCT FROM 'shipped' THEN
            RETURN json_build_object(
                'success', false,
                'error', 'Order cannot be marked delivered before maker shipment'
            );
        END IF;
    END IF;

    v_old_status := v_order.status::TEXT;

    -- Build status history entry
    v_status_history := COALESCE(v_order.status_history, '[]'::jsonb);
    v_status_history := v_status_history || jsonb_build_object(
        'from', v_old_status,
        'to', p_new_status,
        'reason', p_reason,
        'changed_by', v_admin_id,
        'changed_at', NOW()
    );

    -- Update order
    UPDATE orders
    SET
        status = p_new_status::order_status,
        status_history = v_status_history,
        admin_notes = COALESCE(p_admin_notes, admin_notes),
        updated_at = NOW(),
        payment_confirmed_at = CASE
            WHEN p_new_status = 'paid' AND payment_confirmed_at IS NULL THEN NOW()
            ELSE payment_confirmed_at
        END
    WHERE id = p_order_id;

    -- Create audit log entry
    INSERT INTO admin_audit_log (
        admin_id, action_type, target_type, target_id,
        before_state, after_state, reason
    ) VALUES (
        v_admin_id,
        'order_status_update',
        'order',
        p_order_id,
        jsonb_build_object('status', v_old_status),
        jsonb_build_object('status', p_new_status, 'admin_notes', p_admin_notes),
        p_reason
    );

    RETURN json_build_object(
        'success', true,
        'old_status', v_old_status,
        'new_status', p_new_status,
        'message', 'Order status updated'
    );
END;
$$;
