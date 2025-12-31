-- Create RPC function for secure gift card redemption
-- This function validates and redeems gift cards server-side only

CREATE OR REPLACE FUNCTION public.redeem_gift_card(p_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_gift_card RECORD;
  v_credits_value INTEGER;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get the authenticated user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Authentication required');
  END IF;
  
  -- Find the gift card by code (case-insensitive)
  SELECT * INTO v_gift_card
  FROM gift_cards
  WHERE UPPER(TRIM(code)) = UPPER(TRIM(p_code))
  FOR UPDATE; -- Lock the row to prevent race conditions
  
  -- Check if gift card exists
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Gift card code not found');
  END IF;
  
  -- Check if already redeemed
  IF v_gift_card.is_redeemed = true THEN
    RETURN json_build_object('success', false, 'error', 'This gift card has already been redeemed');
  END IF;
  
  -- Check if expired
  IF v_gift_card.expires_at IS NOT NULL AND v_gift_card.expires_at < NOW() THEN
    RETURN json_build_object('success', false, 'error', 'This gift card has expired');
  END IF;
  
  v_credits_value := v_gift_card.credits_value;
  
  -- Get current wallet balance
  SELECT balance INTO v_current_balance
  FROM credit_wallets
  WHERE user_id = v_user_id;
  
  IF NOT FOUND THEN
    -- Create wallet if doesn't exist
    INSERT INTO credit_wallets (user_id, balance, lifetime_earned)
    VALUES (v_user_id, v_credits_value, v_credits_value);
    v_new_balance := v_credits_value;
  ELSE
    v_new_balance := v_current_balance + v_credits_value;
    
    -- Update wallet balance
    UPDATE credit_wallets
    SET balance = v_new_balance,
        lifetime_earned = lifetime_earned + v_credits_value,
        updated_at = NOW()
    WHERE user_id = v_user_id;
  END IF;
  
  -- Mark gift card as redeemed
  UPDATE gift_cards
  SET is_redeemed = true,
      redeemed_by = v_user_id,
      redeemed_at = NOW()
  WHERE id = v_gift_card.id;
  
  -- Record the credit transaction
  INSERT INTO credit_transactions (user_id, type, amount, balance_after, description, reference_id)
  VALUES (v_user_id, 'gift_card', v_credits_value, v_new_balance, 'Gift card redemption', v_gift_card.id);
  
  RETURN json_build_object(
    'success', true, 
    'credits_value', v_credits_value,
    'new_balance', v_new_balance,
    'message', 'Successfully redeemed ' || v_credits_value || ' credits!'
  );
END;
$$;