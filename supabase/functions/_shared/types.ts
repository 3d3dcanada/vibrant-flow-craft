// Shared TypeScript types for Edge Functions
// Date: 2026-01-07

export type MaterialType =
    | 'PLA_STANDARD'
    | 'PLA_SPECIALTY'
    | 'PETG'
    | 'PETG_CF'
    | 'TPU'
    | 'ABS_ASA';

export type ColorOption =
    | 'black'
    | 'white'
    | 'gray'
    | 'red'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'purple'
    | 'custom';

export type DeliverySpeed = 'standard' | 'emergency';
export type Quality = 'draft' | 'standard' | 'high';
export type PostProcessingTier = 'standard' | 'advanced';

export interface QuoteRequest {
    file_metadata?: {
        volume_cm3: number;
        surface_area_cm2: number;
        bounding_box: { x: number; y: number; z: number };
    };
    grams?: number; // Manual gram input (alternative to file_metadata)
    material: MaterialType;
    quality: Quality;
    quantity: number;
    color?: ColorOption;
    post_processing?: {
        enabled: boolean;
        tier?: PostProcessingTier;
        minutes?: number;
    };
    delivery_speed: DeliverySpeed;
    rush_rate?: number; // 0.15 or 0.25
}

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

export interface MakerPayout {
    bed_rental: number;
    material_share: number;
    post_processing_share: number;
    total: number;
}

export interface QuoteResponse {
    quote_id: string;
    expires_at: string;
    breakdown: PriceBreakdown;
    maker_payout: MakerPayout;
    designer_royalty: number;
    estimated_print_time_hours: number;
    dfm_warnings?: string[];
}

export interface FraudFlags {
    rapid_accumulation?: boolean;
    suspicious_pattern?: boolean;
    referral_chain?: boolean;
    duplicate_content?: boolean;
    verification_failed?: boolean;
    ip_abuse?: boolean;
}
