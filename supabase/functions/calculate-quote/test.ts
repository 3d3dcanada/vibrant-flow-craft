// Tests for calculate-quote Edge Function
// Date: 2026-01-07

import { assertEquals, assertExists } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { calculateQuote, calculateWeightFromVolume, estimatePrintTime } from '../_shared/pricing.ts';

Deno.test('calculateWeightFromVolume - PLA Standard', () => {
    const weight = calculateWeightFromVolume(100, 'PLA_STANDARD'); // 100 cm³
    assertEquals(weight, 124); // 100 * 1.24 density
});

Deno.test('estimatePrintTime - 100g print', () => {
    const hours = estimatePrintTime(100);
    assertEquals(hours, (100 * 3.5) / 60); // ~5.83 hours
});

Deno.test('calculateQuote - minimum order enforcement', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 34, // ~$3 filament
        quantity: 1,
        deliverySpeed: 'standard',
    });

    // Should enforce $18 minimum
    assertEquals(result.breakdown.total, 18.00);
    assertExists(result.breakdown.minimum_adjustment);
});

Deno.test('calculateQuote - quantity discount 10+', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 100,
        quantity: 10,
        deliverySpeed: 'standard',
    });

    // Should apply 10% discount
    assertExists(result.breakdown.quantity_discount);
    assertEquals(result.breakdown.quantity_discount > 0, true);
});

Deno.test('calculateQuote - rush surcharge', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 100,
        quantity: 1,
        deliverySpeed: 'emergency',
        rushRate: 0.15,
    });

    // Should have rush surcharge
    assertExists(result.breakdown.rush_surcharge);
    assertEquals(result.breakdown.rush_surcharge > 0, true);
});

Deno.test('calculateQuote - maker payout calculation', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 100,
        quantity: 1,
        deliverySpeed: 'standard',
    });

    // Maker should get bed rental + material share
    assertExists(result.makerPayout);
    assertEquals(result.makerPayout.bed_rental, 10.00); // Minimum bed rental
    assertEquals(result.makerPayout.material_share, 100 * 0.06); // 100g * $0.06/g
    assertEquals(result.makerPayout.total, result.makerPayout.bed_rental + result.makerPayout.material_share);
});

Deno.test('calculateQuote - pricing accuracy', () => {
    const result = calculateQuote({
        material: 'PLA_STANDARD',
        grams: 125, // $11.25 filament
        quantity: 1,
        deliverySpeed: 'standard',
    });

    // Expected: $5 platform + $10 bed + $11.25 filament = $26.25
    assertEquals(result.breakdown.platform_fee, 5.00);
    assertEquals(result.breakdown.bed_rental, 10.00);
    assertEquals(result.breakdown.filament_cost, 11.25);
    assertEquals(result.breakdown.total, 26.25);
});
