-- Customer fulfillment RPC (Phase 3F safe exposure)
-- Date: 2026-01-14
-- Purpose: Provide customer-safe fulfillment data without exposing maker identity

CREATE OR REPLACE FUNCTION public.customer_get_order_fulfillment(
    p_order_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_order RECORD;
    v_maker_order RECORD;
    v_tracking_info JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Authentication required');
    END IF;

    SELECT * INTO v_order FROM orders WHERE id = p_order_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Order not found');
    END IF;

    IF v_order.user_id <> v_user_id THEN
        RETURN json_build_object('success', false, 'error', 'Access denied');
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

    RETURN json_build_object(
        'success', true,
        'data', json_build_object(
            'order_id', v_order.id,
            'order_status', v_order.status,
            'payment_confirmed_at', v_order.payment_confirmed_at,
            'status_history', v_order.status_history,
            'maker_stage', CASE WHEN FOUND THEN v_maker_order.status ELSE NULL END,
            'tracking_info', v_tracking_info
        )
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.customer_get_order_fulfillment(UUID) TO authenticated;

COMMENT ON FUNCTION public.customer_get_order_fulfillment IS 'Customer-safe fulfillment snapshot for an order (no maker identity).';
