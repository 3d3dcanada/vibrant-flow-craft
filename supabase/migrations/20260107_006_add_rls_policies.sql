-- Migration: Add additional RLS policies for Phase 1
-- Date: 2026-01-07
-- Author: Agent B

-- Note: Most RLS policies already created in previous migrations
-- This migration adds any additional policies needed for Phase 1

-- Ensure quotes table has proper policies (already created in 001, this is verification)
-- No additional policies needed at this time

-- Add policy for guests to create quotes with session_id
-- (Already covered in 001 migration)

-- Add comment to document RLS strategy
COMMENT ON TABLE public.quotes IS 'Stores quote configurations. RLS ensures users can only see their own quotes (via user_id or session_id). Admins can see all quotes.';
COMMENT ON TABLE public.point_transactions IS 'Stores point transaction history. RLS ensures users can only see their own transactions. Admins can see and update all transactions for verification workflow.';

-- Verify RLS is enabled on all critical tables
DO $$
DECLARE
  tables_to_check TEXT[] := ARRAY[
    'profiles',
    'subscriptions',
    'credit_wallets',
    'point_wallets',
    'point_transactions',
    'quotes',
    'print_requests',
    'creator_models',
    'user_roles'
  ];
  table_name TEXT;
  rls_enabled BOOLEAN;
BEGIN
  FOREACH table_name IN ARRAY tables_to_check
  LOOP
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = table_name AND relnamespace = 'public'::regnamespace;
    
    IF NOT rls_enabled THEN
      RAISE EXCEPTION 'RLS not enabled on table: %', table_name;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'RLS verification complete: all critical tables have RLS enabled';
END $$;

-- Rollback script
-- (No changes to rollback, this is verification only)
