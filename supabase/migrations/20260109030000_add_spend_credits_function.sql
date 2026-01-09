-- Phase 3D: Credits Economy - Spend Credits Function
-- Server-side function to safely deduct credits at checkout
-- This ensures atomic operations and proper audit trail

-- Create spend_credits function for checkout
CREATE OR REPLACE FUNCTION public.spend_credits(
    p_amount INTEGER,
    p_order_id UUID,
    p_description TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_current_balance INTEGER;
    v_new_balance INTEGER;
    v_actual_description TEXT;
BEGIN
    -- Get the authenticated user
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Authentication required');
    END IF;
    
    -- Validate amount
    IF p_amount <= 0 THEN
        RETURN json_build_object('success', false, 'error', 'Amount must be positive');
    END IF;
    
    -- Get current wallet balance with row lock
    SELECT balance INTO v_current_balance
    FROM credit_wallets
    WHERE user_id = v_user_id
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Credit wallet not found');
    END IF;
    
    -- Check sufficient balance
    IF v_current_balance < p_amount THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Insufficient credits',
            'available', v_current_balance,
            'requested', p_amount
        );
    END IF;
    
    -- Calculate new balance
    v_new_balance := v_current_balance - p_amount;
    
    -- Update wallet balance
    UPDATE credit_wallets
    SET balance = v_new_balance,
        lifetime_spent = lifetime_spent + p_amount,
        updated_at = NOW()
    WHERE user_id = v_user_id;
    
    -- Create description
    v_actual_description := COALESCE(p_description, 'Order payment');
    
    -- Record the credit transaction
    INSERT INTO credit_transactions (
        user_id, 
        type, 
        amount, 
        balance_after, 
        description, 
        reference_id
    )
    VALUES (
        v_user_id, 
        'spend', 
        -p_amount, -- Negative for spend
        v_new_balance, 
        v_actual_description, 
        p_order_id
    );
    
    RETURN json_build_object(
        'success', true,
        'amount_spent', p_amount,
        'new_balance', v_new_balance,
        'previous_balance', v_current_balance,
        'message', 'Successfully spent ' || p_amount || ' credits'
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.spend_credits(INTEGER, UUID, TEXT) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.spend_credits IS 'Deducts credits from user wallet for order payment. Used at checkout for credit-based payments. Ensures atomic operations and creates audit trail.';
