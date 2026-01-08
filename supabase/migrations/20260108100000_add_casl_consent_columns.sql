-- CASL Compliance Migration
-- Adds consent tracking columns to profiles table

-- Add consent columns for email marketing
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS consent_email_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS consent_ip_address TEXT,
ADD COLUMN IF NOT EXISTS consent_email_marketing BOOLEAN DEFAULT FALSE;

-- Add comment explaining CASL requirements
COMMENT ON COLUMN profiles.consent_email_timestamp IS 'Timestamp when user consented to email marketing (CASL requirement)';
COMMENT ON COLUMN profiles.consent_ip_address IS 'IP address at time of consent (CASL audit trail)';
COMMENT ON COLUMN profiles.consent_email_marketing IS 'Whether user has given explicit consent for marketing emails';

-- Create index for consent queries
CREATE INDEX IF NOT EXISTS idx_profiles_consent_marketing 
ON profiles(consent_email_marketing) 
WHERE consent_email_marketing = TRUE;
