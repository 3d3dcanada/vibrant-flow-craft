-- Phase 3E: Admin Operations & Audit Logging
-- Date: 2026-01-09
-- Purpose: Create audit logging infrastructure for admin operations

-- Create admin audit log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action_type TEXT NOT NULL,
    target_type TEXT NOT NULL, -- 'order', 'credit_wallet', 'gift_card', 'user', etc.
    target_id UUID NOT NULL,
    before_state JSONB,
    after_state JSONB,
    reason TEXT,
    metadata JSONB DEFAULT '{}', -- Additional context
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_type ON public.admin_audit_log(target_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_id ON public.admin_audit_log(target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action_type ON public.admin_audit_log(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);

-- Enable RLS
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS: Only admins can view audit logs
CREATE POLICY "Admins can view audit log"
ON public.admin_audit_log FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    )
);

-- RLS: Only admins can insert audit logs
CREATE POLICY "Admins can insert audit log"
ON public.admin_audit_log FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    )
);

-- Audit log cannot be updated or deleted (immutable)
-- No UPDATE or DELETE policies

-- Create function for admin order status update with audit logging
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
BEGIN
    -- Verify admin
    v_admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_admin_id AND role = 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;
    
    -- Get current order state
    SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Order not found');
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

-- Create function for admin payment confirmation
CREATE OR REPLACE FUNCTION public.admin_confirm_payment(
    p_order_id UUID,
    p_payment_reference TEXT DEFAULT NULL,
    p_reason TEXT DEFAULT NULL
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
BEGIN
    v_admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_admin_id AND role = 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;
    
    SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Order not found');
    END IF;
    
    -- Only allow confirmation if awaiting payment
    IF v_order.status NOT IN ('awaiting_payment', 'pending_payment') THEN
        RETURN json_build_object('success', false, 'error', 'Order is not awaiting payment');
    END IF;
    
    v_old_status := v_order.status::TEXT;
    
    -- Update to paid
    UPDATE orders
    SET 
        status = 'paid',
        payment_confirmed_at = NOW(),
        notes = COALESCE(notes || E'\n', '') || 'Payment confirmed by admin. Ref: ' || COALESCE(p_payment_reference, 'N/A'),
        status_history = COALESCE(status_history, '[]'::jsonb) || jsonb_build_object(
            'from', v_old_status,
            'to', 'paid',
            'reason', COALESCE(p_reason, 'Admin payment confirmation'),
            'reference', p_payment_reference,
            'changed_by', v_admin_id,
            'changed_at', NOW()
        ),
        updated_at = NOW()
    WHERE id = p_order_id;
    
    -- Audit log
    INSERT INTO admin_audit_log (
        admin_id, action_type, target_type, target_id,
        before_state, after_state, reason
    ) VALUES (
        v_admin_id,
        'payment_confirmation',
        'order',
        p_order_id,
        jsonb_build_object('status', v_old_status, 'payment_confirmed_at', NULL),
        jsonb_build_object('status', 'paid', 'payment_confirmed_at', NOW(), 'reference', p_payment_reference),
        COALESCE(p_reason, 'Payment confirmed')
    );
    
    RETURN json_build_object(
        'success', true,
        'order_id', p_order_id,
        'new_status', 'paid',
        'message', 'Payment confirmed successfully'
    );
END;
$$;

-- Create function for admin credit adjustment
CREATE OR REPLACE FUNCTION public.admin_adjust_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason TEXT,
    p_type TEXT DEFAULT 'adjustment' -- 'bonus', 'correction', 'refund', 'adjustment'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID;
    v_wallet RECORD;
    v_new_balance INTEGER;
BEGIN
    v_admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_admin_id AND role = 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;
    
    IF p_reason IS NULL OR TRIM(p_reason) = '' THEN
        RETURN json_build_object('success', false, 'error', 'Reason is required for credit adjustments');
    END IF;
    
    -- Get wallet with lock
    SELECT * INTO v_wallet FROM credit_wallets WHERE user_id = p_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'User credit wallet not found');
    END IF;
    
    v_new_balance := v_wallet.balance + p_amount;
    
    -- Prevent negative balance
    IF v_new_balance < 0 THEN
        RETURN json_build_object('success', false, 'error', 'Insufficient credits for deduction');
    END IF;
    
    -- Update wallet
    UPDATE credit_wallets
    SET 
        balance = v_new_balance,
        lifetime_earned = CASE WHEN p_amount > 0 THEN lifetime_earned + p_amount ELSE lifetime_earned END,
        lifetime_spent = CASE WHEN p_amount < 0 THEN lifetime_spent + ABS(p_amount) ELSE lifetime_spent END,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record transaction
    INSERT INTO credit_transactions (
        user_id, type, amount, balance_after, description
    ) VALUES (
        p_user_id,
        p_type,
        p_amount,
        v_new_balance,
        'Admin: ' || p_reason
    );
    
    -- Audit log
    INSERT INTO admin_audit_log (
        admin_id, action_type, target_type, target_id,
        before_state, after_state, reason
    ) VALUES (
        v_admin_id,
        'credit_adjustment',
        'credit_wallet',
        v_wallet.id,
        jsonb_build_object('balance', v_wallet.balance),
        jsonb_build_object('balance', v_new_balance, 'adjustment', p_amount, 'type', p_type),
        p_reason
    );
    
    RETURN json_build_object(
        'success', true,
        'user_id', p_user_id,
        'old_balance', v_wallet.balance,
        'new_balance', v_new_balance,
        'adjustment', p_amount,
        'message', 'Credits adjusted successfully'
    );
END;
$$;

-- Create function for admin gift card approval
CREATE OR REPLACE FUNCTION public.admin_approve_gift_card(
    p_gift_card_id UUID,
    p_approved BOOLEAN,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_id UUID;
    v_gift_card RECORD;
BEGIN
    v_admin_id := auth.uid();
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = v_admin_id AND role = 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;
    
    SELECT * INTO v_gift_card FROM gift_cards WHERE id = p_gift_card_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Gift card not found');
    END IF;
    
    -- Audit log
    INSERT INTO admin_audit_log (
        admin_id, action_type, target_type, target_id,
        before_state, after_state, reason
    ) VALUES (
        v_admin_id,
        CASE WHEN p_approved THEN 'gift_card_approved' ELSE 'gift_card_rejected' END,
        'gift_card',
        p_gift_card_id,
        jsonb_build_object('is_redeemed', v_gift_card.is_redeemed),
        jsonb_build_object('approved', p_approved),
        p_reason
    );
    
    RETURN json_build_object(
        'success', true,
        'gift_card_id', p_gift_card_id,
        'approved', p_approved,
        'message', CASE WHEN p_approved THEN 'Gift card approved' ELSE 'Gift card rejected' END
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.admin_update_order_status(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_confirm_payment(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_adjust_credits(UUID, INTEGER, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_gift_card(UUID, BOOLEAN, TEXT) TO authenticated;

-- Comments
COMMENT ON TABLE public.admin_audit_log IS 'Immutable audit trail for all admin operations. Cannot be modified or deleted.';
COMMENT ON FUNCTION public.admin_update_order_status IS 'Update order status with full audit trail. Admin only.';
COMMENT ON FUNCTION public.admin_confirm_payment IS 'Confirm payment for pending orders. Admin only.';
COMMENT ON FUNCTION public.admin_adjust_credits IS 'Adjust user credit balance with required reason. Admin only.';
