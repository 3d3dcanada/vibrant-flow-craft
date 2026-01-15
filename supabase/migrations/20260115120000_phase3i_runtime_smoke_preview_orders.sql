-- Phase 3I Runtime Smoke (Preview Orders + Fulfillment Snapshot)
-- Date: 2026-01-15
-- Purpose: Allow admin audit tooling to find preview orders and verify customer-safe fulfillment snapshots.

CREATE OR REPLACE FUNCTION public.admin_get_preview_orders()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID;
    v_orders JSONB;
BEGIN
    v_admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_admin_id AND role = 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;

    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', orders.id,
                'order_number', orders.order_number,
                'status', orders.status
            )
        ),
        '[]'::jsonb
    )
    INTO v_orders
    FROM orders
    WHERE order_number IN ('3D-PREVIEW-A', '3D-PREVIEW-B')
    ORDER BY created_at DESC;

    RETURN json_build_object(
        'success', true,
        'data', json_build_object(
            'orders', v_orders
        )
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_preview_fulfillment_snapshot(
    p_order_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID;
    v_order RECORD;
    v_maker_order RECORD;
    v_tracking_info JSONB;
    v_sanitized_history JSONB;
    v_entry_rec RECORD;
BEGIN
    v_admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_admin_id AND role = 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;

    SELECT id, status, order_number, payment_confirmed_at, status_history
    INTO v_order
    FROM orders
    WHERE id = p_order_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Order not found');
    END IF;

    IF v_order.order_number NOT IN ('3D-PREVIEW-A', '3D-PREVIEW-B') THEN
        RETURN json_build_object('success', false, 'error', 'Preview order required');
    END IF;

    SELECT status, tracking_info
    INTO v_maker_order
    FROM maker_orders
    WHERE order_id = p_order_id
    LIMIT 1;

    IF FOUND THEN
        IF v_maker_order.status IN ('shipped', 'completed') OR v_order.status IN ('shipped', 'delivered') THEN
            v_tracking_info := NULLIF(v_maker_order.tracking_info, '{}'::jsonb);
        ELSE
            v_tracking_info := NULL;
        END IF;
    ELSE
        v_tracking_info := NULL;
    END IF;

    v_sanitized_history := '[]'::jsonb;
    IF v_order.status_history IS NOT NULL AND jsonb_typeof(v_order.status_history) = 'array' THEN
        FOR v_entry_rec IN
            SELECT jsonb_array_elements(v_order.status_history) AS entry
        LOOP
            v_sanitized_history := v_sanitized_history || jsonb_build_array(
                jsonb_build_object(
                    'from', v_entry_rec.entry->>'from',
                    'to', v_entry_rec.entry->>'to',
                    'reason', v_entry_rec.entry->>'reason',
                    'changed_at', v_entry_rec.entry->>'changed_at'
                )
            );
        END LOOP;
    END IF;

    RETURN json_build_object(
        'success', true,
        'data', json_build_object(
            'order_id', v_order.id,
            'order_status', v_order.status,
            'payment_confirmed_at', v_order.payment_confirmed_at,
            'status_history', v_sanitized_history,
            'maker_stage', CASE WHEN FOUND THEN v_maker_order.status ELSE NULL END,
            'tracking_info', v_tracking_info
        )
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_preview_orders() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_preview_fulfillment_snapshot(UUID) TO authenticated;

COMMENT ON FUNCTION public.admin_get_preview_orders IS 'Admin-only preview order lookup for launch smoke validation.';
COMMENT ON FUNCTION public.admin_get_preview_fulfillment_snapshot IS 'Admin-only preview fulfillment snapshot (customer-safe fields only).';
