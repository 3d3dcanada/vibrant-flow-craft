-- Migration: Alter creator_models for royalty tracking and quality metrics
-- Date: 2026-01-07
-- Author: Agent B

-- Add new columns for designer royalties and quality scoring
ALTER TABLE public.creator_models
ADD COLUMN IF NOT EXISTS designer_royalty_rate DECIMAL(5,4) DEFAULT 0.0025 CHECK (designer_royalty_rate >= 0 AND designer_royalty_rate <= 1),
ADD COLUMN IF NOT EXISTS total_royalties_earned DECIMAL(10,2) DEFAULT 0 CHECK (total_royalties_earned >= 0),
ADD COLUMN IF NOT EXISTS complexity_score INTEGER CHECK (complexity_score >= 0 AND complexity_score <= 100),
ADD COLUMN IF NOT EXISTS originality_score INTEGER CHECK (originality_score >= 0 AND originality_score <= 100),
ADD COLUMN IF NOT EXISTS quality_flags JSONB;

-- Create index for royalty queries
CREATE INDEX IF NOT EXISTS idx_creator_models_creator_id_royalties ON public.creator_models(creator_id, total_royalties_earned DESC);

-- Add comments for documentation
COMMENT ON COLUMN public.creator_models.designer_royalty_rate IS 'Royalty rate for this model (default 0.0025 = $0.25 per $100)';
COMMENT ON COLUMN public.creator_models.total_royalties_earned IS 'Total royalties earned from this model in CAD';
COMMENT ON COLUMN public.creator_models.complexity_score IS 'Complexity score (0-100) based on polygon count, features, etc.';
COMMENT ON COLUMN public.creator_models.originality_score IS 'Originality score (0-100) to detect plagiarism/duplicates';
COMMENT ON COLUMN public.creator_models.quality_flags IS 'JSON object containing quality assessment flags';

-- Rollback script
-- DROP INDEX IF EXISTS idx_creator_models_creator_id_royalties;
-- ALTER TABLE public.creator_models DROP COLUMN IF EXISTS quality_flags;
-- ALTER TABLE public.creator_models DROP COLUMN IF EXISTS originality_score;
-- ALTER TABLE public.creator_models DROP COLUMN IF EXISTS complexity_score;
-- ALTER TABLE public.creator_models DROP COLUMN IF EXISTS total_royalties_earned;
-- ALTER TABLE public.creator_models DROP COLUMN IF EXISTS designer_royalty_rate;
