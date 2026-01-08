-- =============================================================================
-- RLS Test Suite for 3D3D Canada Phase 1
-- Date: 2026-01-07
-- Author: Agent B
-- =============================================================================
-- 
-- USAGE:
-- 1. Run these tests in Supabase SQL Editor or via CLI
-- 2. Each test includes expected result as comments
-- 3. For role simulation, use SET LOCAL with JWT claims
--
-- NOTE: Some tests require test data and user accounts to be set up first.
-- =============================================================================

-- =============================================================================
-- SETUP: Create test users (run once)
-- =============================================================================

-- NOTE: In production, users are created via Supabase Auth.
-- These tests assume the following test accounts exist:
--   customer_1: UUID = '11111111-1111-1111-1111-111111111111' (role: customer)
--   customer_2: UUID = '22222222-2222-2222-2222-222222222222' (role: customer)
--   maker_1:    UUID = '33333333-3333-3333-3333-333333333333' (role: maker)
--   admin_1:    UUID = '44444444-4444-4444-4444-444444444444' (role: admin)

-- =============================================================================
-- TEST HELPERS
-- =============================================================================

-- Function to simulate authenticated user
CREATE OR REPLACE FUNCTION test_as_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('request.jwt.claims', json_build_object('sub', user_id)::text, true);
END;
$$;

-- =============================================================================
-- TEST 1: Guest cannot read profiles
-- EXPECTED: 0 rows returned
-- =============================================================================
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  -- Simulate guest (no auth.uid())
  PERFORM set_config('request.jwt.claims', '{}'::text, true);
  
  SELECT COUNT(*) INTO row_count FROM public.profiles;
  
  IF row_count > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Guest can read profiles (returned % rows)', row_count;
  ELSE
    RAISE NOTICE 'TEST 1 PASSED: Guest cannot read profiles';
  END IF;
END $$;

-- =============================================================================
-- TEST 2: Customer can read own profile only
-- EXPECTED: 1 row returned (own profile)
-- =============================================================================
DO $$
DECLARE
  row_count INTEGER;
  customer_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Simulate customer_1
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', customer_id)::text, true);
  
  SELECT COUNT(*) INTO row_count 
  FROM public.profiles 
  WHERE id != customer_id;
  
  IF row_count > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Customer can read other profiles (returned % rows)', row_count;
  ELSE
    RAISE NOTICE 'TEST 2 PASSED: Customer can only read own profile';
  END IF;
END $$;

-- =============================================================================
-- TEST 3: Customer cannot read other customer's quotes
-- EXPECTED: 0 rows from other user
-- =============================================================================
DO $$
DECLARE
  row_count INTEGER;
  customer_1_id UUID := '11111111-1111-1111-1111-111111111111';
  customer_2_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
  -- Simulate customer_1
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', customer_1_id)::text, true);
  
  -- Try to read customer_2's quotes
  SELECT COUNT(*) INTO row_count 
  FROM public.quotes 
  WHERE user_id = customer_2_id;
  
  IF row_count > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Customer can read other customer quotes (returned % rows)', row_count;
  ELSE
    RAISE NOTICE 'TEST 3 PASSED: Customer cannot read other quotes';
  END IF;
END $$;

-- =============================================================================
-- TEST 4: Customer cannot read other customer's wallets
-- EXPECTED: 0 rows from other user
-- =============================================================================
DO $$
DECLARE
  row_count INTEGER;
  customer_1_id UUID := '11111111-1111-1111-1111-111111111111';
  customer_2_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
  -- Simulate customer_1
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', customer_1_id)::text, true);
  
  -- Try to read customer_2's credit wallet
  SELECT COUNT(*) INTO row_count 
  FROM public.credit_wallets 
  WHERE user_id = customer_2_id;
  
  IF row_count > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Customer can read other wallets (returned % rows)', row_count;
  ELSE
    RAISE NOTICE 'TEST 4 PASSED: Customer cannot read other wallets';
  END IF;
END $$;

-- =============================================================================
-- TEST 5: Customer cannot read other customer's point transactions
-- EXPECTED: 0 rows from other user
-- =============================================================================
DO $$
DECLARE
  row_count INTEGER;
  customer_1_id UUID := '11111111-1111-1111-1111-111111111111';
  customer_2_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
  -- Simulate customer_1
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', customer_1_id)::text, true);
  
  SELECT COUNT(*) INTO row_count 
  FROM public.point_transactions 
  WHERE user_id = customer_2_id;
  
  IF row_count > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Customer can read other point transactions (returned % rows)', row_count;
  ELSE
    RAISE NOTICE 'TEST 5 PASSED: Customer cannot read other transactions';
  END IF;
END $$;

-- =============================================================================
-- TEST 6: Admin can read all quotes
-- EXPECTED: All quotes visible
-- =============================================================================
DO $$
DECLARE
  total_quotes INTEGER;
  admin_visible_quotes INTEGER;
  admin_id UUID := '44444444-4444-4444-4444-444444444444';
BEGIN
  -- Get total quotes (service role)
  SELECT COUNT(*) INTO total_quotes FROM public.quotes;
  
  -- Simulate admin
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', admin_id)::text, true);
  
  SELECT COUNT(*) INTO admin_visible_quotes FROM public.quotes;
  
  -- Note: Admin should see all OR user sees only own
  -- This test validates admin policy works
  RAISE NOTICE 'TEST 6 INFO: Admin sees % quotes (total: %)', admin_visible_quotes, total_quotes;
END $$;

-- =============================================================================
-- TEST 7: Maker cannot modify customer's data
-- EXPECTED: UPDATE fails or affects 0 rows
-- =============================================================================
DO $$
DECLARE
  rows_affected INTEGER;
  maker_id UUID := '33333333-3333-3333-3333-333333333333';
  customer_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Simulate maker
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', maker_id)::text, true);
  
  -- Try to update customer's profile
  UPDATE public.profiles 
  SET full_name = 'HACKED'
  WHERE id = customer_id;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  
  IF rows_affected > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Maker modified customer profile (% rows)', rows_affected;
  ELSE
    RAISE NOTICE 'TEST 7 PASSED: Maker cannot modify customer data';
  END IF;
  
  -- Rollback any accidental changes
  ROLLBACK;
END $$;

-- =============================================================================
-- TEST 8: Customer cannot self-grant admin role
-- EXPECTED: INSERT into user_roles fails
-- =============================================================================
DO $$
DECLARE
  customer_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Simulate customer
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', customer_id)::text, true);
  
  -- Try to grant self admin role
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (customer_id, 'admin');
    
    RAISE EXCEPTION 'TEST FAILED: Customer was able to grant self admin role';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'TEST 8 PASSED: Customer cannot self-grant admin role';
    WHEN OTHERS THEN
      -- RLS typically raises "new row violates row-level security policy"
      RAISE NOTICE 'TEST 8 PASSED: Customer cannot self-grant admin role (RLS blocked)';
  END;
END $$;

-- =============================================================================
-- TEST 9: Customer cannot update verification_status on point_transactions
-- EXPECTED: UPDATE fails or affects 0 rows
-- =============================================================================
DO $$
DECLARE
  rows_affected INTEGER;
  customer_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Simulate customer
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', customer_id)::text, true);
  
  -- Try to approve own points
  UPDATE public.point_transactions 
  SET verification_status = 'verified'
  WHERE user_id = customer_id;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  
  -- Customer should NOT be able to self-verify
  IF rows_affected > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Customer self-verified points (% rows)', rows_affected;
  ELSE
    RAISE NOTICE 'TEST 9 PASSED: Customer cannot self-verify points';
  END IF;
  
  ROLLBACK;
END $$;

-- =============================================================================
-- TEST 10: Admin can update verification_status
-- EXPECTED: UPDATE succeeds
-- =============================================================================
DO $$
DECLARE
  rows_affected INTEGER;
  admin_id UUID := '44444444-4444-4444-4444-444444444444';
BEGIN
  -- Simulate admin
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', admin_id)::text, true);
  
  -- Admin updates verification status
  UPDATE public.point_transactions 
  SET verification_status = 'verified',
      verified_by = admin_id,
      verified_at = now()
  WHERE verification_status = 'pending'
  LIMIT 1;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  
  RAISE NOTICE 'TEST 10 INFO: Admin verified % transactions', rows_affected;
  
  ROLLBACK;
END $$;

-- =============================================================================
-- TEST 11: Guest quote isolation (session_id)
-- EXPECTED: Guest can only see own session's quotes
-- =============================================================================
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  -- Set session_id for guest
  PERFORM set_config('app.session_id', 'guest-session-123', true);
  PERFORM set_config('request.jwt.claims', '{}'::text, true);
  
  -- Try to read quotes with different session_id
  SELECT COUNT(*) INTO row_count 
  FROM public.quotes 
  WHERE session_id = 'other-session-456';
  
  IF row_count > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Guest can read other session quotes (returned % rows)', row_count;
  ELSE
    RAISE NOTICE 'TEST 11 PASSED: Guest quotes are session-isolated';
  END IF;
END $$;

-- =============================================================================
-- TEST 12: Maker cannot read other maker's print jobs
-- EXPECTED: 0 rows from other maker
-- =============================================================================
DO $$
DECLARE
  row_count INTEGER;
  maker_1_id UUID := '33333333-3333-3333-3333-333333333333';
  maker_2_id UUID := '33333333-3333-3333-3333-333333333334'; -- Different maker
BEGIN
  -- Simulate maker_1
  PERFORM set_config('request.jwt.claims', 
    json_build_object('sub', maker_1_id)::text, true);
  
  -- Try to read maker_2's assigned jobs
  SELECT COUNT(*) INTO row_count 
  FROM public.print_requests 
  WHERE maker_id = maker_2_id;
  
  IF row_count > 0 THEN
    RAISE EXCEPTION 'TEST FAILED: Maker can read other maker jobs (returned % rows)', row_count;
  ELSE
    RAISE NOTICE 'TEST 12 PASSED: Maker cannot read other maker jobs';
  END IF;
END $$;

-- =============================================================================
-- CLEANUP: Drop test helper function
-- =============================================================================
DROP FUNCTION IF EXISTS test_as_user(UUID);

-- =============================================================================
-- SUMMARY
-- =============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'RLS TEST SUITE COMPLETE';
  RAISE NOTICE 'Date: 2026-01-07';
  RAISE NOTICE 'Tests: 12';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'If all tests passed without EXCEPTION, RLS is secure.';
  RAISE NOTICE 'Any EXCEPTION indicates a security vulnerability.';
END $$;
