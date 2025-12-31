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
export const MINIMUM_FILAMENT_CAD = 3.00; // Filament minimum charge
export const DESIGNER_ROYALTY_INCLUDED = 0.25; // Allocated from admin fee (display only)

// ============= Minimum Order =============
export const MINIMUM_ORDER_TOTAL = 18.00; // $5 admin + $10 bed + $3 min filament
export const MINIMUM_BED_RENTAL = 10.00; // Bed rental NEVER below this

// ============= Job Sizes (routing + default time estimates) =============
export type JobSize = 'small' | 'medium' | 'large';
export const JOB_SIZE_DEFAULTS: Record<JobSize, { label: string; defaultHours: number }> = {
  small: { label: 'Small', defaultHours: 2 },
  medium: { label: 'Medium', defaultHours: 6 },
  large: { label: 'Large', defaultHours: 12 },
};

// ============= Bed Rental Tiers (Maker Payment) =============
// Based on estimated print time, but NEVER < $10
export const BED_RENTAL_TIERS = [
  { maxHours: 6, rate: 10.00, label: '0-6 hours' },
  { maxHours: 24, rate: 14.00, label: '6-24 hours' },
  { maxHours: Infinity, rate: 18.00, label: '24+ hours (base)' },
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
export type MaterialType = 
  | 'PLA_STANDARD' 
  | 'PLA_SPECIALTY' 
  | 'PETG' 
  | 'PETG_CF' 
  | 'TPU' 
  | 'ABS_ASA';

export const MATERIAL_RATES: Record<MaterialType, { 
  customerRate: number; 
  makerRate: number; 
  name: string; 
  isSpecialty: boolean;
  category: string;
}> = {
  PLA_STANDARD: { customerRate: 0.09, makerRate: 0.06, name: 'PLA Standard', isSpecialty: false, category: 'Standard' },
  PLA_SPECIALTY: { customerRate: 0.14, makerRate: 0.09, name: 'PLA Specialty (Glow/Wood/etc)', isSpecialty: true, category: 'Specialty' },
  PETG: { customerRate: 0.11, makerRate: 0.07, name: 'PETG', isSpecialty: false, category: 'Standard' },
  PETG_CF: { customerRate: 0.35, makerRate: 0.25, name: 'PETG-CF (Carbon Fiber)', isSpecialty: true, category: 'Engineering' },
  TPU: { customerRate: 0.18, makerRate: 0.12, name: 'TPU (Flexible)', isSpecialty: true, category: 'Specialty' },
  ABS_ASA: { customerRate: 0.13, makerRate: 0.08, name: 'ABS/ASA', isSpecialty: false, category: 'Engineering' },
};

// ============= Color Options =============
export type ColorOption = 'black' | 'white' | 'gray' | 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'custom';
export const COLOR_OPTIONS: { value: ColorOption; label: string; hex?: string }[] = [
  { value: 'black', label: 'Black', hex: '#1a1a1a' },
  { value: 'white', label: 'White', hex: '#f5f5f5' },
  { value: 'gray', label: 'Gray', hex: '#808080' },
  { value: 'red', label: 'Red', hex: '#e53935' },
  { value: 'blue', label: 'Blue', hex: '#1e88e5' },
  { value: 'green', label: 'Green', hex: '#43a047' },
  { value: 'yellow', label: 'Yellow', hex: '#fdd835' },
  { value: 'orange', label: 'Orange', hex: '#fb8c00' },
  { value: 'purple', label: 'Purple', hex: '#8e24aa' },
  { value: 'custom', label: 'Custom / TBD' },
];

// ============= Quantity Quick Buttons =============
export const QUANTITY_QUICK_OPTIONS = [1, 2, 5, 10, 25, 50, 100];

// ============= Post-Processing Rates =============
export type PostProcessingTier = 'standard' | 'advanced';
export const POST_PROCESSING_RATES: Record<PostProcessingTier, { ratePerHour: number; makerRate: number; label: string }> = {
  standard: { ratePerHour: 25.00, makerRate: 20.00, label: 'Standard ($25/hr)' },
  advanced: { ratePerHour: 35.00, makerRate: 28.00, label: 'Advanced ($35/hr)' },
};

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

// Get minimum grams for a material (ensures filament total >= $3)
export function getMinimumGrams(material: MaterialType): number {
  const rate = MATERIAL_RATES[material].customerRate;
  return Math.ceil(MINIMUM_FILAMENT_CAD / rate);
}

export function getPostProcessingCost(tier: PostProcessingTier | null, minutes: number): { customer: number; maker: number } {
  if (!tier || minutes <= 0) return { customer: 0, maker: 0 };
  const rates = POST_PROCESSING_RATES[tier];
  const hours = minutes / 60;
  return {
    customer: hours * rates.ratePerHour,
    maker: hours * rates.makerRate,
  };
}

// Estimate print time from weight (rough heuristic: ~3.5 min per gram)
export function estimatePrintTimeFromWeight(grams: number): number {
  return Math.max(0.5, (grams * 3.5) / 60);
}

// ============= Quote Breakdown Types =============
export interface QuoteLineItem {
  label: string;
  amount: number;
  details?: string;
  type: 'fee' | 'material' | 'labor' | 'adjustment' | 'discount' | 'rush' | 'info';
  eligibleForRush?: boolean;
  show?: boolean;
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
  materialType: MaterialType;
  grams: number;
  qty: number;
  hours?: number;
  jobSize: JobSize;
  deliverySpeed: DeliverySpeed;
  rushRate?: number;
  postProcessingEnabled: boolean;
  postProcessingTier: PostProcessingTier;
  postProcessingMinutes: number;
  isMember: boolean;
  color?: ColorOption;
}

export function calculateQuoteBreakdown(input: QuoteInput): QuoteBreakdown {
  const {
    materialType,
    grams,
    qty,
    hours,
    jobSize,
    deliverySpeed,
    rushRate = RUSH_RATES.emergency,
    postProcessingEnabled,
    postProcessingTier,
    postProcessingMinutes,
    isMember,
  } = input;

  // Use provided hours or estimate from jobSize defaults
  const printTimeHours = hours ?? JOB_SIZE_DEFAULTS[jobSize].defaultHours;
  
  const lineItems: QuoteLineItem[] = [];
  let rushEligibleSubtotal = 0;
  let eligibleSubtotal = 0;
  
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
  
  // 3. Filament Total (single line) - calculated directly, min enforced by input
  // Since grams minimum is enforced in UI, filament total will always be >= $3
  const materialCost = getMaterialCost(materialType, grams);
  const filamentTotalCad = materialCost.customer;
  const materialName = MATERIAL_RATES[materialType].name;
  
  lineItems.push({
    label: `Filament Total (${materialName})`,
    amount: filamentTotalCad,
    details: `${grams}g × ${formatCad(MATERIAL_RATES[materialType].customerRate)}/g`,
    type: 'material',
    eligibleForRush: true,
  });
  rushEligibleSubtotal += filamentTotalCad;
  eligibleSubtotal += filamentTotalCad;
  
  // 7. Post-Processing (if selected) - ELIGIBLE for rush
  if (postProcessingEnabled && postProcessingMinutes > 0) {
    const ppCost = getPostProcessingCost(postProcessingTier, postProcessingMinutes);
    if (ppCost.customer > 0) {
      const ppHours = (postProcessingMinutes / 60).toFixed(2);
      lineItems.push({
        label: `Post-Processing (${POST_PROCESSING_RATES[postProcessingTier].label})`,
        amount: ppCost.customer,
        details: `${ppHours}h @ ${formatCad(POST_PROCESSING_RATES[postProcessingTier].ratePerHour)}/hr`,
        type: 'labor',
        eligibleForRush: true,
      });
      rushEligibleSubtotal += ppCost.customer;
      eligibleSubtotal += ppCost.customer;
    }
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
  const unitSubtotal = lineItems.reduce((sum, item) => 
    item.type !== 'info' ? sum + item.amount : sum, 0
  );
  
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
    show: false,
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
  
  // Calculate member discount (only on eligible subtotal)
  const memberDiscount = eligibleSubtotal * FREE_MEMBER_DISCOUNT_RATE;
  const memberTotal = Math.max(MINIMUM_ORDER_TOTAL, total - memberDiscount);
  const memberSavings = total - memberTotal;
  
  // Maker payout calculation
  const ppCost = getPostProcessingCost(
    postProcessingEnabled ? postProcessingTier : null, 
    postProcessingMinutes
  );
  const makerPayout = {
    bedRental: bedRental.rate * qty,
    materialShare: materialCost.maker * qty,
    postProcessingShare: ppCost.maker * qty,
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
