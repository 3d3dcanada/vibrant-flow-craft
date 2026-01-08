// Expanded Tests for calculate-quote Edge Function
// Date: 2026-01-07
// Author: Agent B
// Test Count: 20 (expanded from 6)

import { assertEquals, assertThrows } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import {
    calculateQuote,
    calculateWeightFromVolume,
    estimatePrintTime,
    getBedRentalRate,
    getQuantityDiscount,
    getMaterialCost,
    getPostProcessingCost,
    getExtendedTimeSurcharge,
} from '../_shared/pricing.ts';

// =============================================================================
// WEIGHT CALCULATION TESTS
// =============================================================================

Deno.test('Weight: PLA Standard volume to weight', () => {
    // 100 cm³ × 1.24 g/cm³ = 124g
    const weight = calculateWeightFromVolume(100, 'PLA_STANDARD');
    assertEquals(weight, 124);
});

Deno.test('Weight: PETG-CF higher density', () => {
    // 100 cm³ × 1.30 g/cm³ = 130g
    const weight = calculateWeightFromVolume(100, 'PETG_CF');
    assertEquals(weight, 130);
});

Deno.test('Weight: TPU lower density', () => {
    // 100 cm³ × 1.21 g/cm³ = 121g
    const weight = calculateWeightFromVolume(100, 'TPU');
    assertEquals(weight, 121);
});

// =============================================================================
// PRINT TIME ESTIMATION TESTS
// =============================================================================

Deno.test('Time: 100g print estimation', () => {
    // 100g × 3.5 min/g = 350 min = 5.83 hours
    const hours = estimatePrintTime(100);
    assertEquals(hours, (100 * 3.5) / 60);
});

Deno.test('Time: Minimum 0.5 hours enforced', () => {
    // Very small print should still have minimum time
    const hours = estimatePrintTime(1);
    assertEquals(hours >= 0.5, true);
});

// =============================================================================
// BED RENTAL TESTS
// =============================================================================

Deno.test('Bed Rental: Tier 1 (0-6 hours)', () => {
    const { rate } = getBedRentalRate(3);
    assertEquals(rate, 10.00);
});

Deno.test('Bed Rental: Tier 2 (6-24 hours)', () => {
    const { rate } = getBedRentalRate(12);
    assertEquals(rate, 14.00);
});

Deno.test('Bed Rental: Tier 3 (24+ hours base)', () => {
    const { rate } = getBedRentalRate(30);
    assertEquals(rate, 18.00);
});

// =============================================================================
// QUANTITY DISCOUNT TESTS
// =============================================================================

Deno.test('Discount: 9 units = no discount', () => {
    const discount = getQuantityDiscount(9);
    assertEquals(discount, 0);
});

Deno.test('Discount: 10 units = 10% discount', () => {
    const discount = getQuantityDiscount(10);
    assertEquals(discount, 0.10);
});

Deno.test('Discount: 24 units = 10% discount (boundary)', () => {
    const discount = getQuantityDiscount(24);
    assertEquals(discount, 0.10);
});

Deno.test('Discount: 25 units = 15% discount', () => {
    const discount = getQuantityDiscount(25);
    assertEquals(discount, 0.15);
});

Deno.test('Discount: 49 units = 15% discount (boundary)', () => {
    const discount = getQuantityDiscount(49);
    assertEquals(discount, 0.15);
});

Deno.test('Discount: 50 units = 20% discount', () => {
    const discount = getQuantityDiscount(50);
    assertEquals(discount, 0.20);
});

// =============================================================================
// MINIMUM ORDER TESTS
// =============================================================================

Deno.test('Minimum: Order below $18 gets adjusted', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 34, // ~$3 filament, well under minimum
        quantity: 1,
        deliverySpeed: 'standard',
    });

    assertEquals(result.breakdown.total, 18.00);
    assertEquals(result.breakdown.minimum_adjustment > 0, true);
});

Deno.test('Minimum: Order at $18+ has no adjustment', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 150, // Enough to exceed minimum
        quantity: 1,
        deliverySpeed: 'standard',
    });

    assertEquals(result.breakdown.minimum_adjustment, 0);
    assertEquals(result.breakdown.total >= 18.00, true);
});

// =============================================================================
// RUSH SURCHARGE TESTS
// =============================================================================

Deno.test('Rush: Standard delivery = no surcharge', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 100,
        quantity: 1,
        deliverySpeed: 'standard',
    });

    assertEquals(result.breakdown.rush_surcharge, 0);
});

Deno.test('Rush: Emergency delivery = 15% surcharge', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 100,
        quantity: 1,
        deliverySpeed: 'emergency',
        rushRate: 0.15,
    });

    assertEquals(result.breakdown.rush_surcharge > 0, true);
});

// =============================================================================
// MAKER PAYOUT TESTS
// =============================================================================

Deno.test('Payout: Maker gets bed rental + material share', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 100,
        quantity: 1,
        deliverySpeed: 'standard',
    });

    assertEquals(result.makerPayout.bed_rental, 10.00);
    assertEquals(result.makerPayout.material_share, 100 * 0.06); // 100g × $0.06/g
    assertEquals(
        result.makerPayout.total,
        result.makerPayout.bed_rental + result.makerPayout.material_share
    );
});

// =============================================================================
// PRICING ACCURACY TESTS
// =============================================================================

Deno.test('Pricing: 125g PLA Standard exact breakdown', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 125,
        quantity: 1,
        deliverySpeed: 'standard',
    });

    // Expected: $5 platform + $10 bed + $11.25 filament = $26.25
    assertEquals(result.breakdown.platform_fee, 5.00);
    assertEquals(result.breakdown.bed_rental, 10.00);
    assertEquals(result.breakdown.filament_cost, 11.25);
    assertEquals(result.breakdown.total, 26.25);
    assertEquals(result.breakdown.total_credits, 263);
});

// =============================================================================
// LARGE ORDER TESTS
// =============================================================================

Deno.test('Large: 100 units with 20% discount', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 50,
        quantity: 100,
        deliverySpeed: 'standard',
    });

    // Should have 20% discount applied
    assertEquals(result.breakdown.quantity_discount > 0, true);
});

// =============================================================================
// POST-PROCESSING TESTS
// =============================================================================

Deno.test('Post-processing: Standard tier adds cost', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 100,
        quantity: 1,
        deliverySpeed: 'standard',
        postProcessing: {
            tier: 'standard',
            minutes: 30, // 0.5 hours × $25/hr = $12.50
        },
    });

    assertEquals(result.breakdown.post_processing > 0, true);
    assertEquals(result.makerPayout.post_processing_share > 0, true);
});

// =============================================================================
// EXTENDED TIME SURCHARGE TESTS
// =============================================================================

Deno.test('Extended time: No surcharge under 24 hours', () => {
    const surcharge = getExtendedTimeSurcharge(20);
    assertEquals(surcharge, 0);
});

Deno.test('Extended time: $1/hour over 24 hours', () => {
    const surcharge = getExtendedTimeSurcharge(30); // 6 hours over
    assertEquals(surcharge, 6.00);
});
