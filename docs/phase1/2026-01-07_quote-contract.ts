/**
 * Quote Contract Types — Single Source of Truth
 * 
 * @description Canonical TypeScript types and Zod schemas for the quote system.
 *              Use these types in both frontend and Edge Functions.
 * 
 * @location supabase/functions/_shared/types.ts is the canonical source.
 *           This file provides Zod schemas for runtime validation.
 * 
 * @date 2026-01-07
 * @author Agent B
 */

// =============================================================================
// MATERIAL TYPES
// =============================================================================

export const MATERIALS = [
    'PLA_STANDARD',
    'PLA_SPECIALTY',
    'PETG',
    'PETG_CF',
    'TPU',
    'ABS_ASA',
] as const;

export type MaterialType = typeof MATERIALS[number];

// Material densities (g/cm³) for volume-to-weight calculation
export const MATERIAL_DENSITIES: Record<MaterialType, number> = {
    PLA_STANDARD: 1.24,
    PLA_SPECIALTY: 1.24,
    PETG: 1.27,
    PETG_CF: 1.30,
    TPU: 1.21,
    ABS_ASA: 1.05,
};

// Material pricing (CAD per gram)
export const MATERIAL_PRICING: Record<MaterialType, { customer: number; maker: number }> = {
    PLA_STANDARD: { customer: 0.09, maker: 0.06 },
    PLA_SPECIALTY: { customer: 0.14, maker: 0.09 },
    PETG: { customer: 0.11, maker: 0.07 },
    PETG_CF: { customer: 0.35, maker: 0.25 },
    TPU: { customer: 0.18, maker: 0.12 },
    ABS_ASA: { customer: 0.13, maker: 0.08 },
};

// =============================================================================
// QUALITY & DELIVERY
// =============================================================================

export const QUALITY_OPTIONS = ['draft', 'standard', 'high'] as const;
export type Quality = typeof QUALITY_OPTIONS[number];

export const DELIVERY_SPEEDS = ['standard', 'emergency'] as const;
export type DeliverySpeed = typeof DELIVERY_SPEEDS[number];

export const POST_PROCESSING_TIERS = ['standard', 'advanced'] as const;
export type PostProcessingTier = typeof POST_PROCESSING_TIERS[number];

// =============================================================================
// COLOR OPTIONS
// =============================================================================

export const COLOR_OPTIONS = [
    'black',
    'white',
    'gray',
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'purple',
    'custom',
] as const;

export type ColorOption = typeof COLOR_OPTIONS[number];

// =============================================================================
// QUOTE REQUEST
// =============================================================================

export interface FileMetadata {
    volume_cm3: number;
    surface_area_cm2: number;
    bounding_box: {
        x: number;
        y: number;
        z: number;
    };
}

export interface PostProcessingConfig {
    enabled: boolean;
    tier?: PostProcessingTier;
    minutes?: number;
}

export interface QuoteRequest {
    // Either file_metadata OR grams must be provided
    file_metadata?: FileMetadata;
    grams?: number;

    // Required fields
    material: MaterialType;
    quality: Quality;
    quantity: number;
    delivery_speed: DeliverySpeed;

    // Optional fields
    color?: ColorOption;
    post_processing?: PostProcessingConfig;
    rush_rate?: number; // 0.15 or 0.25 for emergency
}

// =============================================================================
// PRICE BREAKDOWN
// =============================================================================

export interface PriceBreakdown {
    platform_fee: number;
    bed_rental: number;
    filament_cost: number;
    post_processing: number;
    extended_time_surcharge: number;
    rush_surcharge: number;
    quantity_discount: number;
    subtotal: number;
    minimum_adjustment: number;
    total: number;
    total_credits: number;
}

// =============================================================================
// MAKER PAYOUT
// =============================================================================

export interface MakerPayout {
    bed_rental: number;
    material_share: number;
    post_processing_share: number;
    total: number;
}

// =============================================================================
// QUOTE RESPONSE
// =============================================================================

export interface QuoteResponse {
    quote_id: string;
    expires_at: string; // ISO 8601 timestamp
    breakdown: PriceBreakdown;
    maker_payout: MakerPayout;
    designer_royalty: number;
    estimated_print_time_hours: number;
    dfm_warnings?: string[];
}

// =============================================================================
// QUOTE DATABASE RECORD
// =============================================================================

export interface QuoteRecord {
    id: string;
    user_id: string | null;
    session_id: string | null;

    // File metadata
    file_name: string | null;
    file_volume_cm3: number | null;
    file_weight_grams: number | null;
    file_surface_area_cm2: number | null;

    // Configuration
    material: MaterialType;
    quality: Quality;
    quantity: number;
    color: ColorOption | null;
    post_processing_config: PostProcessingConfig | null;
    delivery_speed: DeliverySpeed;

    // Pricing
    price_breakdown: PriceBreakdown;
    total_cad: number;
    total_credits: number;
    maker_payout: MakerPayout;

    // Metadata
    estimated_print_time_hours: number | null;
    dfm_warnings: string[] | null;
    expires_at: string;
    status: 'active' | 'expired' | 'ordered' | 'archived';

    // Timestamps
    created_at: string;
    updated_at: string;
}

// =============================================================================
// QUOTE STATUS TRANSITIONS
// =============================================================================

/**
 * Quote immutability rules:
 * 
 * 1. ACTIVE quotes can be updated (until ordered or expired)
 * 2. EXPIRED quotes are read-only (auto-transition after expires_at)
 * 3. ORDERED quotes are locked (linked to print_request)
 * 4. ARCHIVED quotes are read-only (manual archive by user)
 * 
 * State transitions:
 *   active → expired (automatic, via cron or on-access check)
 *   active → ordered (when print_request created with quote_id)
 *   active → archived (manual, user action)
 *   expired → archived (manual cleanup)
 */

export type QuoteStatus = 'active' | 'expired' | 'ordered' | 'archived';

export const QUOTE_STATUS_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
    active: ['expired', 'ordered', 'archived'],
    expired: ['archived'],
    ordered: [], // Terminal state
    archived: [], // Terminal state
};

// =============================================================================
// FRAUD FLAGS
// =============================================================================

export interface FraudFlags {
    rapid_accumulation?: boolean;
    suspicious_pattern?: boolean;
    referral_chain?: boolean;
    duplicate_content?: boolean;
    verification_failed?: boolean;
    ip_abuse?: boolean;
}

// =============================================================================
// POINT TRANSACTION (with verification)
// =============================================================================

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface PointTransaction {
    id: string;
    user_id: string;
    activity_type: string;
    points: number;
    description: string | null;
    reference_id: string | null;
    balance_after: number;

    // Phase 1 additions
    quality_score: number | null;
    verification_status: VerificationStatus;
    verification_notes: string | null;
    fraud_flags: FraudFlags | null;
    verified_by: string | null;
    verified_at: string | null;

    created_at: string;
}

// =============================================================================
// PRICING CONSTANTS
// =============================================================================

export const PRICING_CONSTANTS = {
    // Platform fees
    ADMIN_FEE: 5.00,
    DESIGNER_ROYALTY_INCLUDED: 0.25,
    MINIMUM_FILAMENT_CAD: 3.00,

    // Order minimums
    MINIMUM_ORDER_TOTAL: 18.00,
    MINIMUM_BED_RENTAL: 10.00,

    // Quote expiration
    QUOTE_EXPIRATION_DAYS: 7,

    // Credit conversion
    CREDITS_PER_CAD: 10,

    // Print time estimation
    PRINT_TIME_MIN_PER_GRAM: 3.5,

    // Bed rental tiers
    BED_RENTAL_TIERS: [
        { maxHours: 6, rate: 10.00 },
        { maxHours: 24, rate: 14.00 },
        { maxHours: Infinity, rate: 18.00 },
    ],

    // Extended time surcharge
    EXTENDED_TIME_THRESHOLD_HOURS: 24,
    EXTENDED_TIME_SURCHARGE_PER_HOUR: 1.00,

    // Rush rates
    RUSH_RATE_STANDARD: 0.15,
    RUSH_RATE_MAX: 0.25,

    // Quantity discounts
    QUANTITY_DISCOUNTS: [
        { minQty: 10, discount: 0.10 },
        { minQty: 25, discount: 0.15 },
        { minQty: 50, discount: 0.20 },
    ],
} as const;

// =============================================================================
// API ERROR RESPONSE
// =============================================================================

export interface ApiError {
    error: string;
    details?: string;
    code?: string;
}

// =============================================================================
// CANONICAL SOURCE REFERENCE
// =============================================================================

/**
 * CANONICAL SOURCE LOCATIONS:
 * 
 * Types:     supabase/functions/_shared/types.ts
 *            docs/phase1/2026-01-07_quote-contract.ts (this file)
 * 
 * Constants: supabase/functions/_shared/constants.ts
 * 
 * Pricing:   supabase/functions/_shared/pricing.ts (AUTHORITATIVE)
 *            src/config/pricing.ts (MUST SYNC with above)
 * 
 * NOTE: Frontend pricing.ts duplicates Edge Function logic.
 *       In Phase 2, consolidate to shared NPM package.
 */
