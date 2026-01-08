-- Migration: Enable leaked password protection
-- Date: 2026-01-07
-- Author: Agent B

-- WARNING: This will force password resets for users with weak passwords
-- Ensure users are notified before running in production

-- Enable leaked password protection in Supabase Auth
-- Note: This setting is configured via Supabase Dashboard, not SQL
-- This migration serves as documentation and verification

-- To enable: Supabase Dashboard → Authentication → Policies → Enable "Leaked Password Protection"

-- Documentation-only migration - no SQL changes required
-- The actual setting must be enabled via Supabase Dashboard
DO $$
BEGIN
  RAISE NOTICE 'REMINDER: Enable leaked password protection via Supabase Dashboard → Authentication → Policies';
END
$$;

-- Create a function to check if a password is in the leaked password list
-- (This is handled by Supabase Auth, but we document the expectation)

-- Log this migration for audit trail
DO $$
BEGIN
  RAISE NOTICE 'Migration 007: Leaked password protection should be enabled via Supabase Dashboard';
  RAISE NOTICE 'Navigate to: Authentication → Policies → Enable "Leaked Password Protection"';
  RAISE NOTICE 'WARNING: This may force password resets for users with weak passwords';
END $$;

-- Rollback script
-- (Leaked password protection is disabled via Supabase Dashboard, not SQL)
-- Navigate to: Authentication → Policies → Disable "Leaked Password Protection"
