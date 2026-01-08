-- Migration: Alter point_transactions for fraud detection and verification
-- Date: 2026-01-07
-- Author: Agent B

-- Add new columns for quality-based rewards and fraud detection
ALTER TABLE public.point_transactions
ADD COLUMN IF NOT EXISTS quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS fraud_flags JSONB,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Create index for verification workflow
CREATE INDEX IF NOT EXISTS idx_point_transactions_verification_status ON public.point_transactions(verification_status);
CREATE INDEX IF NOT EXISTS idx_point_transactions_verified_by ON public.point_transactions(verified_by) WHERE verified_by IS NOT NULL;

-- Add RLS policies for admin verification workflow

-- Admins can view all point transactions
CREATE POLICY "Admins can view all point transactions" 
  ON public.point_transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Admins can update verification status
CREATE POLICY "Admins can update verification status" 
  ON public.point_transactions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Add comments for documentation
COMMENT ON COLUMN public.point_transactions.quality_score IS 'Quality score (0-100) for activities like recycling drops and model uploads';
COMMENT ON COLUMN public.point_transactions.verification_status IS 'Admin verification status: pending, verified, or rejected';
COMMENT ON COLUMN public.point_transactions.verification_notes IS 'Admin notes explaining verification decision';
COMMENT ON COLUMN public.point_transactions.fraud_flags IS 'JSON object containing fraud detection signals (rapid_accumulation, suspicious_pattern, etc.)';
COMMENT ON COLUMN public.point_transactions.verified_by IS 'Admin user who verified this transaction';
COMMENT ON COLUMN public.point_transactions.verified_at IS 'Timestamp when verification was completed';

-- Rollback script
-- DROP POLICY IF EXISTS "Admins can update verification status" ON public.point_transactions;
-- DROP POLICY IF EXISTS "Admins can view all point transactions" ON public.point_transactions;
-- DROP INDEX IF EXISTS idx_point_transactions_verified_by;
-- DROP INDEX IF EXISTS idx_point_transactions_verification_status;
-- ALTER TABLE public.point_transactions DROP COLUMN IF EXISTS verified_at;
-- ALTER TABLE public.point_transactions DROP COLUMN IF EXISTS verified_by;
-- ALTER TABLE public.point_transactions DROP COLUMN IF EXISTS fraud_flags;
-- ALTER TABLE public.point_transactions DROP COLUMN IF EXISTS verification_notes;
-- ALTER TABLE public.point_transactions DROP COLUMN IF EXISTS verification_status;
-- ALTER TABLE public.point_transactions DROP COLUMN IF EXISTS quality_score;
