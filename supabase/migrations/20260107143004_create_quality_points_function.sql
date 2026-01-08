-- Migration: Create calculate_quality_points function
-- Date: 2026-01-07
-- Author: Agent B

-- Function to calculate quality-adjusted points with fraud penalties
CREATE OR REPLACE FUNCTION public.calculate_quality_points(
  activity_type public.point_activity_type,
  base_points INTEGER,
  quality_score INTEGER DEFAULT NULL,
  fraud_flags JSONB DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  multiplier DECIMAL := 1.0;
  final_points INTEGER;
BEGIN
  -- Validate inputs
  IF base_points < 0 THEN
    RAISE EXCEPTION 'base_points must be non-negative';
  END IF;
  
  IF quality_score IS NOT NULL AND (quality_score < 0 OR quality_score > 100) THEN
    RAISE EXCEPTION 'quality_score must be between 0 and 100';
  END IF;
  
  -- Apply quality multiplier for quality-based activities
  IF activity_type IN ('recycling_drop', 'model_upload') AND quality_score IS NOT NULL THEN
    -- Quality multiplier ranges from 0.5x to 3.0x based on score
    -- Score of 50 = 1.0x, score of 100 = 2.0x, score of 0 = 0.5x
    multiplier := GREATEST(0.5, LEAST(3.0, (quality_score / 100.0) * 2.0));
  END IF;
  
  -- Apply fraud penalties if fraud_flags provided
  IF fraud_flags IS NOT NULL THEN
    -- Rapid accumulation penalty (50% reduction)
    IF (fraud_flags->>'rapid_accumulation')::boolean = true THEN
      multiplier := multiplier * 0.5;
    END IF;
    
    -- Suspicious pattern penalty (70% reduction)
    IF (fraud_flags->>'suspicious_pattern')::boolean = true THEN
      multiplier := multiplier * 0.3;
    END IF;
    
    -- Referral chain penalty (80% reduction)
    IF (fraud_flags->>'referral_chain')::boolean = true THEN
      multiplier := multiplier * 0.2;
    END IF;
    
    -- Verification failed = zero points
    IF (fraud_flags->>'verification_failed')::boolean = true THEN
      RETURN 0;
    END IF;
  END IF;
  
  -- Calculate final points (floor to integer)
  final_points := FLOOR(base_points * multiplier);
  
  -- Ensure non-negative result
  RETURN GREATEST(0, final_points);
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION public.calculate_quality_points IS 'Calculates quality-adjusted reward points with fraud penalties. Quality multiplier (0.5-3.0x) for recycling/model uploads. Fraud flags reduce points or zero them out.';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.calculate_quality_points TO authenticated;

-- Rollback script
-- REVOKE EXECUTE ON FUNCTION public.calculate_quality_points FROM authenticated;
-- DROP FUNCTION IF EXISTS public.calculate_quality_points;
