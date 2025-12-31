/**
 * Pricing Configuration for 3D3D Quote System
 * All values in CAD unless otherwise noted
 * 
 * PRICING MODEL (v1.0 - Non-negotiable):
 * Minimum print total = $18 CAD, composed of:
 * - Admin fee (3D3D): $5 CAD
 * - Bed rental (Maker) minimum: $10 CAD
 * - Base filament included: $3 CAD
 * 
 * Designer royalty ($0.25) is INCLUDED inside the $5 admin fee.
 */

import { cadToCredits, formatCad } from './credits';

// ============= Platform Fees =============
export const ADMIN_FEE = 5.00; // 3D3D platform fee (includes designer royalty)
export const BASE_FILAMENT_INCLUDED = 3.00; // Base filament included in minimum
export const DESIGNER_ROYALTY_INCLUDED = 0.25; // Allocated from admin fee (display only)

// ============= Minimum Order =============
export const MINIMUM_ORDER_TOTAL = 18.00; // $5 admin + $10 bed + $3 base filament
export const MINIMUM_BED_RENTAL = 10.00; // Bed rental NEVER below this

// ============= Bed Rental Tiers (Maker Payment) =============
// Based on estimated print time, but NEVER < $10
export const BED_RENTAL_TIERS = [
  { maxHours: 3, rate: 10.00, label: '0-3 hours' },
  { maxHours: 10, rate: 14.00, label: '3-10 hours' },
  { maxHours: 24, rate: 18.00, label: '10-24 hours' },
  { maxHours: Infinity, rate: 18.00, label: '24+ hours (base)' }, // Base for 24+, surcharge added separately
];

// Extended time surcharge (for prints > 24h)
export const EXTENDED_TIME_SURCHARGE_PER_HOUR = 1.00;
export const EXTENDED_TIME_THRESHOLD_HOURS = 24;

// ============= Rush/Emergency Pricing =============
export type DeliverySpeed = 'standard' | 'emergency';
export const RUSH_RATES = {
  standard: 0.00, // No surcharge
  emergency: 0.15, // 15% default
  emergencyMax: 0.25, // 25% upper option
};

// ============= Material Pricing (per gram) =============
export type MaterialType = 'PLA' | 'PETG' | 'TPU' | 'CARBON';

export const MATERIAL_RATES: Record<MaterialType, { customerRate: number; makerRate: number; name: string; isSpecialty: boolean }> = {
  PLA: { customerRate: 0.09, makerRate: 0.06, name: 'PLA Standard', isSpecialty: false },
  PETG: { customerRate: 0.11, makerRate: 0.07, name: 'PETG Durable', isSpecialty: false },
  TPU: { customerRate: 0.18, makerRate: 0.12, name: 'TPU Flexible', isSpecialty: true },
  CARBON: { customerRate: 0.35, makerRate: 0.25, name: 'Carbon Fiber', isSpecialty: true },
};

// Specialty material upcharge (added on top of base rate)
export const SPECIALTY_UPCHARGE: Record<MaterialType, number> = {
  PLA: 0,
  PETG: 0,
  TPU: 0, // Rate already includes specialty pricing
  CARBON: 0, // Rate already includes specialty pricing
};

// ============= Post-Processing Rates =============
export const POST_PROCESSING_OPTIONS = [
  { id: 'none', label: 'None', ratePerHour: 0, makerRatePerHour: 0 },
  { id: 'sanding', label: 'Sanding & Smoothing', ratePerHour: 15.00, makerRatePerHour: 12.00 },
  { id: 'painting', label: 'Painting (Basic)', ratePerHour: 20.00, makerRatePerHour: 15.00 },
  { id: 'assembly', label: 'Assembly', ratePerHour: 18.00, makerRatePerHour: 14.00 },
];

// ============= Quantity Discounts =============
export const QUANTITY_DISCOUNTS = [
  { minQty: 10, discount: 0.10, label: '10% off' },
  { minQty: 25, discount: 0.15, label: '15% off' },
  { minQty: 50, discount: 0.20, label: '20% off' },
];

// ============= Membership Discounts =============
export const FREE_MEMBER_DISCOUNT_RATE = 0.03; // 3% off eligible subtotal

// ============= SLA Timelines (display only) =============
export const SLA_TIMELINES = {
  standard: '24–48 hours',
  largeJobs: '4–8 days',
  emergency: '+15–25% rush fee',
};

// ============= Helper Functions =============

export function getBedRentalRate(printTimeHours: number): { rate: number; label: string } {
  const tier = BED_RENTAL_TIERS.find(t => printTimeHours <= t.maxHours) || BED_RENTAL_TIERS[BED_RENTAL_TIERS.length - 1];
  // CLAMP: bed rental NEVER below $10
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

export function getPostProcessingCost(optionId: string, hours: number): { customer: number; maker: number } {
  const option = POST_PROCESSING_OPTIONS.find(o => o.id === optionId);
  if (!option || option.id === 'none') return { customer: 0, maker: 0 };
  return {
    customer: hours * option.ratePerHour,
    maker: hours * option.makerRatePerHour,
  };
}

// ============= Quote Breakdown Types =============
export interface QuoteLineItem {
  label: string;
  amount: number;
  details?: string;
  type: 'fee' | 'material' | 'labor' | 'adjustment' | 'discount' | 'rush' | 'info';
  eligibleForRush?: boolean; // Whether this line contributes to rush surcharge base
  show?: boolean; // Whether to display (default true)
}

export interface QuoteBreakdown {
  lineItems: QuoteLineItem[];
  subtotal: number;
  minimumAdjustment: number;
  quantityDiscount: number;
  total: number;
  totalCredits: number;
  // Membership pricing
  eligibleSubtotal: number;
  memberDiscount: number;
  memberTotal: number;
  memberTotalCredits: number;
  memberSavings: number;
  // Rush info
  rushSurcharge: number;
  rushEligibleSubtotal: number;
  // Maker payout
  makerPayout: {
    bedRental: number;
    materialShare: number;
    postProcessingShare: number;
    total: number;
  };
}

export interface QuoteInput {
  material: MaterialType;
  weightGrams: number;
  qty: number;
  printTimeHours?: number;
  postProcessing?: { id: string; hours: number };
  deliverySpeed?: DeliverySpeed;
  rushRate?: number; // Override rush rate (0.15 or 0.25)
  isMember?: boolean;
}

export function calculateQuoteBreakdown(
  material: MaterialType,
  weightGrams: number,
  qty: number,
  printTimeHours: number = 4,
  postProcessing: { id: string; hours: number } = { id: 'none', hours: 0 },
  isMember: boolean = false,
  deliverySpeed: DeliverySpeed = 'standard',
  rushRate: number = RUSH_RATES.emergency
): QuoteBreakdown {
  const lineItems: QuoteLineItem[] = [];
  let rushEligibleSubtotal = 0; // Eligible for rush surcharge
  let eligibleSubtotal = 0; // Eligible for member discount
  
  // 1. Platform/Admin Fee (3D3D): $5.00 - NOT eligible for rush or member discount
  lineItems.push({
    label: 'Platform Fee (3D3D)',
    amount: ADMIN_FEE,
    type: 'fee',
    eligibleForRush: false,
  });
  
  // 2. Bed Rental (Maker): tier value (>= $10) - ELIGIBLE for rush
  const bedRental = getBedRentalRate(printTimeHours);
  lineItems.push({
    label: 'Bed Rental (Maker)',
    amount: bedRental.rate,
    details: bedRental.label,
    type: 'fee',
    eligibleForRush: true,
  });
  rushEligibleSubtotal += bedRental.rate;
  eligibleSubtotal += bedRental.rate;
  
  // 3. Base Filament (included): $3.00 - NOT eligible for rush
  lineItems.push({
    label: 'Base Filament (included)',
    amount: BASE_FILAMENT_INCLUDED,
    type: 'material',
    eligibleForRush: false,
  });
  
  // 4. Calculate material cost
  const materialCost = getMaterialCost(material, weightGrams);
  const additionalFilamentCad = Math.max(0, materialCost.customer - BASE_FILAMENT_INCLUDED);
  
  // 5. Additional Filament: only if > 0 - ELIGIBLE for rush
  if (additionalFilamentCad > 0) {
    lineItems.push({
      label: 'Additional Filament',
      amount: additionalFilamentCad,
      details: `${weightGrams}g × ${formatCad(MATERIAL_RATES[material].customerRate)}/g − ${formatCad(BASE_FILAMENT_INCLUDED)} base`,
      type: 'material',
      eligibleForRush: true,
    });
    rushEligibleSubtotal += additionalFilamentCad;
    eligibleSubtotal += additionalFilamentCad;
  }
  
  // 6. Specialty Material Upcharge (if applicable) - ELIGIBLE for rush
  const specialtyUpcharge = SPECIALTY_UPCHARGE[material];
  if (specialtyUpcharge > 0) {
    const upchargeAmount = specialtyUpcharge * weightGrams;
    lineItems.push({
      label: `Specialty Material (${MATERIAL_RATES[material].name})`,
      amount: upchargeAmount,
      type: 'material',
      eligibleForRush: true,
    });
    rushEligibleSubtotal += upchargeAmount;
    eligibleSubtotal += upchargeAmount;
  }
  
  // 7. Post-Processing (if selected) - ELIGIBLE for rush
  const ppCost = getPostProcessingCost(postProcessing.id, postProcessing.hours);
  if (ppCost.customer > 0) {
    const ppOption = POST_PROCESSING_OPTIONS.find(o => o.id === postProcessing.id);
    lineItems.push({
      label: `Post-Processing (${ppOption?.label})`,
      amount: ppCost.customer,
      details: `${postProcessing.hours}h × ${formatCad(ppOption?.ratePerHour || 0)}/h`,
      type: 'labor',
      eligibleForRush: true,
    });
    rushEligibleSubtotal += ppCost.customer;
    eligibleSubtotal += ppCost.customer;
  }
  
  // 8. Extended Time Surcharge (24h+ only) - ELIGIBLE for rush
  const extendedSurcharge = getExtendedTimeSurcharge(printTimeHours);
  if (extendedSurcharge > 0) {
    const extraHours = Math.ceil(printTimeHours - EXTENDED_TIME_THRESHOLD_HOURS);
    lineItems.push({
      label: '24h+ Time Surcharge',
      amount: extendedSurcharge,
      details: `${extraHours}h × ${formatCad(EXTENDED_TIME_SURCHARGE_PER_HOUR)}/h`,
      type: 'labor',
      eligibleForRush: true,
    });
    rushEligibleSubtotal += extendedSurcharge;
  }
  
  // Calculate subtotal before multiplying by qty
  const unitSubtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  
  // Apply quantity multiplier
  let subtotal = unitSubtotal * qty;
  rushEligibleSubtotal = rushEligibleSubtotal * qty;
  eligibleSubtotal = eligibleSubtotal * qty;
  
  // Quantity discount
  const discountRate = getQuantityDiscount(qty);
  const quantityDiscount = discountRate > 0 ? subtotal * discountRate : 0;
  
  if (quantityDiscount > 0) {
    const discountInfo = QUANTITY_DISCOUNTS.find(d => d.discount === discountRate);
    lineItems.push({
      label: `Quantity Discount (${discountInfo?.label})`,
      amount: -quantityDiscount,
      details: `${qty} units`,
      type: 'discount',
      eligibleForRush: false,
    });
    subtotal -= quantityDiscount;
    // Reduce rush eligible proportionally
    rushEligibleSubtotal = rushEligibleSubtotal * (1 - discountRate);
    eligibleSubtotal = eligibleSubtotal * (1 - discountRate);
  }
  
  // 9. Rush/Emergency Surcharge (if selected) - applied to eligible subtotal
  let rushSurcharge = 0;
  if (deliverySpeed === 'emergency') {
    rushSurcharge = rushEligibleSubtotal * rushRate;
    lineItems.push({
      label: 'Emergency Rush Surcharge',
      amount: rushSurcharge,
      details: `${Math.round(rushRate * 100)}% of eligible charges`,
      type: 'rush',
      eligibleForRush: false,
    });
    subtotal += rushSurcharge;
  }
  
  // 10. Designer Royalty (included in admin) - informational only
  lineItems.push({
    label: 'Designer Royalty (included in admin)',
    amount: 0,
    details: `${formatCad(DESIGNER_ROYALTY_INCLUDED)} allocated from admin fee`,
    type: 'info',
    show: false, // Hidden by default, can be shown optionally
  });
  
  // Minimum order adjustment
  let minimumAdjustment = 0;
  if (subtotal < MINIMUM_ORDER_TOTAL) {
    minimumAdjustment = MINIMUM_ORDER_TOTAL - subtotal;
    lineItems.push({
      label: 'Minimum Order Adjustment',
      amount: minimumAdjustment,
      details: `Min. ${formatCad(MINIMUM_ORDER_TOTAL)}`,
      type: 'adjustment',
      eligibleForRush: false,
    });
  }
  
  const total = subtotal + minimumAdjustment;
  
  // Calculate member discount (only on eligible subtotal - bed rental, material, post-processing)
  const memberDiscount = eligibleSubtotal * FREE_MEMBER_DISCOUNT_RATE;
  const memberTotal = Math.max(MINIMUM_ORDER_TOTAL, total - memberDiscount);
  const memberSavings = total - memberTotal;
  
  // Maker payout calculation
  const makerPayout = {
    bedRental: bedRental.rate * qty,
    materialShare: materialCost.maker * qty,
    postProcessingShare: ppCost.maker * postProcessing.hours * qty,
    total: 0,
  };
  makerPayout.total = makerPayout.bedRental + makerPayout.materialShare + makerPayout.postProcessingShare;
  
  return {
    lineItems,
    subtotal,
    minimumAdjustment,
    quantityDiscount,
    total,
    totalCredits: cadToCredits(total),
    eligibleSubtotal,
    memberDiscount,
    memberTotal,
    memberTotalCredits: cadToCredits(memberTotal),
    memberSavings,
    rushSurcharge,
    rushEligibleSubtotal,
    makerPayout,
  };
}
