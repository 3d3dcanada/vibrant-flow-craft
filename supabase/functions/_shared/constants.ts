// Pricing constants for quote calculation
// Date: 2026-01-07

import type { MaterialType, PostProcessingTier } from './types.ts';

// Platform Fees
export const ADMIN_FEE = 5.00;
export const MINIMUM_FILAMENT_CAD = 3.00;
export const DESIGNER_ROYALTY_INCLUDED = 0.25;

// Minimum Order
export const MINIMUM_ORDER_TOTAL = 18.00;
export const MINIMUM_BED_RENTAL = 10.00;

// Bed Rental Tiers
export const BED_RENTAL_TIERS = [
    { maxHours: 6, rate: 10.00, label: '0-6 hours' },
    { maxHours: 24, rate: 14.00, label: '6-24 hours' },
    { maxHours: Infinity, rate: 18.00, label: '24+ hours (base)' },
];

// Extended Time Surcharge
export const EXTENDED_TIME_SURCHARGE_PER_HOUR = 1.00;
export const EXTENDED_TIME_THRESHOLD_HOURS = 24;

// Rush Rates
export const RUSH_RATES = {
    standard: 0.00,
    emergency: 0.15,
    emergencyMax: 0.25,
};

// Material Pricing (per gram)
export const MATERIAL_RATES: Record<MaterialType, {
    customerRate: number;
    makerRate: number;
    name: string;
    density_g_cm3: number; // Material density for volume calculation
}> = {
    PLA_STANDARD: {
        customerRate: 0.09,
        makerRate: 0.06,
        name: 'PLA Standard',
        density_g_cm3: 1.24
    },
    PLA_SPECIALTY: {
        customerRate: 0.14,
        makerRate: 0.09,
        name: 'PLA Specialty',
        density_g_cm3: 1.24
    },
    PETG: {
        customerRate: 0.11,
        makerRate: 0.07,
        name: 'PETG',
        density_g_cm3: 1.27
    },
    PETG_CF: {
        customerRate: 0.35,
        makerRate: 0.25,
        name: 'PETG-CF',
        density_g_cm3: 1.30
    },
    TPU: {
        customerRate: 0.18,
        makerRate: 0.12,
        name: 'TPU',
        density_g_cm3: 1.21
    },
    ABS_ASA: {
        customerRate: 0.13,
        makerRate: 0.08,
        name: 'ABS/ASA',
        density_g_cm3: 1.05
    },
};

// Post-Processing Rates
export const POST_PROCESSING_RATES: Record<PostProcessingTier, {
    ratePerHour: number;
    makerRate: number;
    label: string;
}> = {
    standard: { ratePerHour: 25.00, makerRate: 20.00, label: 'Standard ($25/hr)' },
    advanced: { ratePerHour: 35.00, makerRate: 28.00, label: 'Advanced ($35/hr)' },
};

// Quantity Discounts
export const QUANTITY_DISCOUNTS = [
    { minQty: 10, discount: 0.10, label: '10% off' },
    { minQty: 25, discount: 0.15, label: '15% off' },
    { minQty: 50, discount: 0.20, label: '20% off' },
];

// Print Time Estimation (minutes per gram)
export const PRINT_TIME_MIN_PER_GRAM = 3.5;

// Credit Conversion
export const CREDITS_PER_CAD = 10;

export function cadToCredits(cad: number): number {
    return Math.round(cad * CREDITS_PER_CAD);
}
