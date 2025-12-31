/**
 * Backend Availability Helper
 * Detects if Supabase is properly configured and available
 */

// Check if required environment variables are present
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Backend is ready if both URL and key are present and non-empty
export const backendReady = Boolean(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl.length > 0 && 
  supabaseKey.length > 0 &&
  supabaseUrl !== 'undefined' &&
  supabaseKey !== 'undefined'
);

// Helper to check backend status
export const getBackendStatus = () => ({
  isReady: backendReady,
  hasUrl: Boolean(supabaseUrl && supabaseUrl !== 'undefined'),
  hasKey: Boolean(supabaseKey && supabaseKey !== 'undefined'),
});

// Contact email for offline fallback
export const CONTACT_EMAIL = "hello@3d3d.ca";
