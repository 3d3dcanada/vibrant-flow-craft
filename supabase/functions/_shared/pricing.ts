// Pricing calculation logic for quote system
// Date: 2026-01-07

import type { MaterialType, PostProcessingTier, PriceBreakdown, MakerPayout } from './types.ts';
import {
    ADMIN_FEE,
    MINIMUM_ORDER_TOTAL,
    MINIMUM_BED_RENTAL,
    BED_RENTAL_TIERS,
    EXTENDED_TIME_SURCHARGE_PER_HOUR,
    EXTENDED_TIME_THRESHOLD_HOURS,
    MATERIAL_RATES,
    POST_PROCESSING_RATES,
    QUANTITY_DISCOUNTS,
    PRINT_TIME_MIN_PER_GRAM,
    cadToCredits,
} from './constants.ts';

export function calculateWeightFromVolume(volume_cm3: number, material: MaterialType): number {
    const density = MATERIAL_RATES[material].density_g_cm3;
    return volume_cm3 * density;
}

export function estimatePrintTime(grams: number): number {
    // Returns hours
    return Math.max(0.5, (grams * PRINT_TIME_MIN_PER_GRAM) / 60);
}

export function getBedRentalRate(printTimeHours: number): { rate: number; label: string } {
    const tier = BED_RENTAL_TIERS.find(t => printTimeHours <= t.maxHours) || BED_RENTAL_TIERS[BED_RENTAL_TIERS.length - 1];
    const rate = Math.max(MINIMUM_BED_RENTAL, tier.rate);
    return { rate, label: tier.label };
}

export function getExtendedTimeSurcharge(printTimeHours: number): number {
    if (printTimeHours <= EXTENDED_TIME_THRESHOLD_HOURS) return 0;
    const extraHours = Math.ceil(printTimeHours - EXTENDED_TIME_THRESHOLD_HOURS);
    return extraHours * EXTENDED_TIME_SURCHARGE_PER_HOUR;
}

export function getQuantityDiscount(qty: number): number {
    const discount = QUANTITY_DISCOUNTS.filter(d => qty >= d.minQty).pop();
    return discount?.discount || 0;
}

export function getMaterialCost(material: MaterialType, grams: number): { customer: number; maker: number } {
    const rates = MATERIAL_RATES[material];
    return {
        customer: grams * rates.customerRate,
        maker: grams * rates.makerRate,
    };
}

export function getPostProcessingCost(
    tier: PostProcessingTier | null,
    minutes: number
): { customer: number; maker: number } {
    if (!tier || minutes <= 0) return { customer: 0, maker: 0 };
    const rates = POST_PROCESSING_RATES[tier];
    const hours = minutes / 60;
    return {
        customer: hours * rates.ratePerHour,
        maker: hours * rates.makerRate,
    };
}

export interface QuoteCalculationInput {
    material: MaterialType;
    grams: number;
    quantity: number;
    printTimeHours?: number;
    deliverySpeed: 'standard' | 'emergency';
    rushRate?: number;
    postProcessing?: {
        tier: PostProcessingTier;
        minutes: number;
    };
}

export function calculateQuote(input: QuoteCalculationInput): {
    breakdown: PriceBreakdown;
    makerPayout: MakerPayout;
    estimatedPrintTimeHours: number;
} {
    const {
        material,
        grams,
        quantity,
        printTimeHours: providedPrintTime,
        deliverySpeed,
        rushRate = 0.15,
        postProcessing,
    } = input;

    // Calculate or use provided print time
    const printTimeHours = providedPrintTime ?? estimatePrintTime(grams);

    // 1. Platform Fee (fixed, not eligible for rush or discounts)
    const platformFee = ADMIN_FEE;

    // 2. Bed Rental (eligible for rush)
    const bedRental = getBedRentalRate(printTimeHours);
    let rushEligibleSubtotal = bedRental.rate;

    // 3. Filament Cost (eligible for rush)
    const materialCost = getMaterialCost(material, grams);
    const filamentCost = materialCost.customer;
    rushEligibleSubtotal += filamentCost;

    // 4. Post-Processing (eligible for rush)
    const ppCost = postProcessing
        ? getPostProcessingCost(postProcessing.tier, postProcessing.minutes)
        : { customer: 0, maker: 0 };
    rushEligibleSubtotal += ppCost.customer;

    // 5. Extended Time Surcharge (eligible for rush)
    const extendedSurcharge = getExtendedTimeSurcharge(printTimeHours);
    rushEligibleSubtotal += extendedSurcharge;

    // Calculate unit subtotal
    const unitSubtotal = platformFee + rushEligibleSubtotal;

    // Apply quantity multiplier
    let subtotal = unitSubtotal * quantity;
    rushEligibleSubtotal = rushEligibleSubtotal * quantity;

    // 6. Quantity Discount
    const discountRate = getQuantityDiscount(quantity);
    const quantityDiscount = discountRate > 0 ? subtotal * discountRate : 0;
    subtotal -= quantityDiscount;
    rushEligibleSubtotal = rushEligibleSubtotal * (1 - discountRate);

    // 7. Rush Surcharge (if emergency delivery)
    const rushSurcharge = deliverySpeed === 'emergency'
        ? rushEligibleSubtotal * rushRate
        : 0;
    subtotal += rushSurcharge;

    // 8. Minimum Order Adjustment
    const minimumAdjustment = subtotal < MINIMUM_ORDER_TOTAL
        ? MINIMUM_ORDER_TOTAL - subtotal
        : 0;

    const total = subtotal + minimumAdjustment;

    // Maker Payout Calculation
    const makerPayout: MakerPayout = {
        bed_rental: bedRental.rate * quantity,
        material_share: materialCost.maker * quantity,
        post_processing_share: ppCost.maker * quantity,
        total: 0,
    };
    makerPayout.total = makerPayout.bed_rental + makerPayout.material_share + makerPayout.post_processing_share;

    // Price Breakdown
    const breakdown: PriceBreakdown = {
        platform_fee: platformFee,
        bed_rental: bedRental.rate,
        filament_cost: filamentCost,
        post_processing: ppCost.customer,
        extended_time_surcharge: extendedSurcharge,
        rush_surcharge: rushSurcharge,
        quantity_discount: quantityDiscount,
        subtotal,
        minimum_adjustment: minimumAdjustment,
        total,
        total_credits: cadToCredits(total),
    };

    return {
        breakdown,
        makerPayout,
        estimatedPrintTimeHours: printTimeHours,
    };
}
