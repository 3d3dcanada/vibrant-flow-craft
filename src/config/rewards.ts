/**
 * Server-side reward configuration - Single source of truth
 * These constants are enforced on the server (edge functions)
 * Client code may reference these for UI display only
 */

// Recycling rewards
export const RECYCLING_REWARDS = {
  /** Maximum grams allowed per single submission (50kg) */
  MAX_GRAMS_PER_SUBMISSION: 50_000,
  /** Maximum recycling submissions per user per day */
  MAX_SUBMISSIONS_PER_DAY: 3,
  /** Points earned per gram of recycled material */
  POINTS_PER_GRAM: 1,
  /** Allowed material types */
  ALLOWED_MATERIALS: ['PLA', 'PETG', 'ABS', 'TPU', 'Nylon', 'Resin', 'Mixed'] as const,
};

// Social share rewards
export const SOCIAL_REWARDS = {
  /** Points for sharing on social media */
  POINTS_PER_SHARE: 25,
  /** Maximum social shares per user per day */
  MAX_SHARES_PER_DAY: 3,
  /** Allowed platforms */
  ALLOWED_PLATFORMS: ['twitter', 'facebook', 'linkedin', 'instagram'] as const,
  /** Allowed share types */
  ALLOWED_SHARE_TYPES: ['print', 'referral', 'achievement', 'model'] as const,
};

// General limits
export const REWARD_LIMITS = {
  /** Maximum total points any user can earn per day across all activities */
  MAX_POINTS_PER_DAY: 2_000,
};

// Referral rewards (for reference - handled by separate system)
export const REFERRAL_REWARDS = {
  /** Points for successful referral conversion */
  POINTS_PER_REFERRAL: 500,
};

// Type exports
export type RecyclingMaterial = typeof RECYCLING_REWARDS.ALLOWED_MATERIALS[number];
export type SocialPlatform = typeof SOCIAL_REWARDS.ALLOWED_PLATFORMS[number];
export type SocialShareType = typeof SOCIAL_REWARDS.ALLOWED_SHARE_TYPES[number];
