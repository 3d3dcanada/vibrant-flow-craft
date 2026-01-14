-- Phase 3G Gate 2 Preview Runner + Audit Guardrails
-- Date: 2026-01-14
-- Purpose: reliable guardrail checks and non-mutating delivered simulation for admin audit

CREATE OR REPLACE FUNCTION public.admin_get_fulfillment_guardrails()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID;
    v_has_authenticated_update_policy BOOLEAN;
    v_maker_orders_write_revoked BOOLEAN;
    v_maker_earnings_write_revoked BOOLEAN;
BEGIN
    v_admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_admin_id AND role = 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'maker_orders'
          AND cmd = 'UPDATE'
          AND roles @> ARRAY['authenticated']::text[]
    ) INTO v_has_authenticated_update_policy;

    SELECT NOT EXISTS (
        SELECT 1
        FROM information_schema.table_privileges
        WHERE table_schema = 'public'
          AND table_name = 'maker_orders'
          AND grantee = 'authenticated'
          AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE')
    ) INTO v_maker_orders_write_revoked;

    SELECT NOT EXISTS (
        SELECT 1
        FROM information_schema.table_privileges
        WHERE table_schema = 'public'
          AND table_name = 'maker_earnings'
          AND grantee = 'authenticated'
          AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE')
    ) INTO v_maker_earnings_write_revoked;

    RETURN json_build_object(
        'success', true,
        'data', json_build_object(
            'maker_orders_has_authenticated_update_policy', v_has_authenticated_update_policy,
            'maker_orders_write_privileges_revoked_for_authenticated', v_maker_orders_write_revoked,
            'maker_earnings_write_privileges_revoked_for_authenticated', v_maker_earnings_write_revoked
        )
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_simulate_delivered_guard(
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
    v_maker_status TEXT;
BEGIN
    v_admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_admin_id AND role = 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;

    SELECT * INTO v_order FROM orders WHERE id = p_order_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Order not found');
    END IF;

    SELECT status INTO v_maker_status
    FROM maker_orders
    WHERE order_id = p_order_id;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Order has no maker assignment');
    END IF;

    IF v_maker_status IS DISTINCT FROM 'shipped' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Order cannot be marked delivered before maker shipment'
        );
    END IF;

    RETURN json_build_object(
        'success', true,
        'message', 'Delivered guard would allow this transition'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_fulfillment_guardrails() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_simulate_delivered_guard(UUID) TO authenticated;

COMMENT ON FUNCTION public.admin_get_fulfillment_guardrails IS 'Admin-only guardrail status for fulfillment policies/privileges.';
COMMENT ON FUNCTION public.admin_simulate_delivered_guard IS 'Admin-only delivered guard simulation (no writes).';
