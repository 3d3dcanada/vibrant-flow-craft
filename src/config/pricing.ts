/**
 * Pricing Configuration for 3D3D Quote System
 * All values in CAD unless otherwise noted
 */

import { cadToCredits, formatCad, formatCredits, CREDITS_PER_CAD } from './credits';

// ============= Platform Fees =============
export const PLATFORM_FEE = 5.00; // 3D3D platform fee (fixed)
export const BASE_HANDLING_FEE = 3.00; // QC/handling fee (fixed)
export const DESIGNER_ROYALTY = 0.25; // Royalty per print to original designer

// ============= Minimum Order =============
export const MINIMUM_ORDER_TOTAL = 18.00; // Minimum order total in CAD

// ============= Bed Rental Tiers (Maker Payment) =============
// Based on estimated print time
export const BED_RENTAL_TIERS = [
  { maxHours: 2, rate: 5.00, label: '0-2 hours' },
  { maxHours: 6, rate: 8.00, label: '2-6 hours' },
  { maxHours: 12, rate: 12.00, label: '6-12 hours' },
  { maxHours: 24, rate: 18.00, label: '12-24 hours' },
  { maxHours: Infinity, rate: 25.00, label: '24+ hours' },
];

// Extended time surcharge (for prints > 24h)
export const EXTENDED_TIME_SURCHARGE_PER_HOUR = 1.00;
export const EXTENDED_TIME_THRESHOLD_HOURS = 24;

// ============= Material Pricing (per gram) =============
export type MaterialType = 'PLA' | 'PETG' | 'TPU' | 'CARBON';

export const MATERIAL_RATES: Record<MaterialType, { customerRate: number; makerRate: number; name: string }> = {
  PLA: { customerRate: 0.09, makerRate: 0.06, name: 'PLA Standard' },
  PETG: { customerRate: 0.11, makerRate: 0.07, name: 'PETG Durable' },
  TPU: { customerRate: 0.18, makerRate: 0.12, name: 'TPU Flexible' },
  CARBON: { customerRate: 0.35, makerRate: 0.25, name: 'Carbon Fiber' },
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

// ============= Helper Functions =============

export function getBedRentalRate(printTimeHours: number): { rate: number; label: string } {
  const tier = BED_RENTAL_TIERS.find(t => printTimeHours <= t.maxHours) || BED_RENTAL_TIERS[BED_RENTAL_TIERS.length - 1];
  return { rate: tier.rate, label: tier.label };
}

export function getExtendedTimeSurcharge(printTimeHours: number): number {
  if (printTimeHours <= EXTENDED_TIME_THRESHOLD_HOURS) return 0;
  const extraHours = printTimeHours - EXTENDED_TIME_THRESHOLD_HOURS;
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

// ============= Membership Discounts =============
export const FREE_MEMBER_DISCOUNT_RATE = 0.03; // 3% off eligible subtotal

// ============= Quote Breakdown Types =============
export interface QuoteLineItem {
  label: string;
  amount: number;
  details?: string;
  type: 'fee' | 'material' | 'labor' | 'adjustment' | 'discount';
  eligibleForMemberDiscount?: boolean;
}

export interface QuoteBreakdown {
  lineItems: QuoteLineItem[];
  subtotal: number;
  minimumAdjustment: number;
  quantityDiscount: number;
  total: number;
  totalCredits: number;
  // Membership pricing
  eligibleSubtotal: number; // Amount eligible for member discount
  memberDiscount: number;
  memberTotal: number;
  memberTotalCredits: number;
  memberSavings: number;
  makerPayout: {
    bedRental: number;
    materialShare: number;
    postProcessingShare: number;
    total: number;
  };
}

export function calculateQuoteBreakdown(
  material: MaterialType,
  weightGrams: number,
  qty: number,
  printTimeHours: number = 4, // default estimate
  postProcessing: { id: string; hours: number } = { id: 'none', hours: 0 },
  isMember: boolean = false
): QuoteBreakdown {
  const lineItems: QuoteLineItem[] = [];
  let eligibleSubtotal = 0; // Track subtotal eligible for member discount
  
  // Platform fee - NOT eligible for discount
  lineItems.push({
    label: 'Platform Fee (3D3D)',
    amount: PLATFORM_FEE,
    type: 'fee',
    eligibleForMemberDiscount: false,
  });
  
  // Bed rental (maker payment) - ELIGIBLE for discount
  const bedRental = getBedRentalRate(printTimeHours);
  lineItems.push({
    label: 'Bed Rental (Maker)',
    amount: bedRental.rate,
    details: bedRental.label,
    type: 'fee',
    eligibleForMemberDiscount: true,
  });
  eligibleSubtotal += bedRental.rate;
  
  // Base handling/QC - NOT eligible for discount
  lineItems.push({
    label: 'Handling & QC',
    amount: BASE_HANDLING_FEE,
    type: 'fee',
    eligibleForMemberDiscount: false,
  });
  
  // Material cost - ELIGIBLE for discount
  const materialCost = getMaterialCost(material, weightGrams);
  lineItems.push({
    label: `Material (${MATERIAL_RATES[material].name})`,
    amount: materialCost.customer,
    details: `${weightGrams}g × ${formatCad(MATERIAL_RATES[material].customerRate)}/g`,
    type: 'material',
    eligibleForMemberDiscount: true,
  });
  eligibleSubtotal += materialCost.customer;
  
  // Extended time surcharge - NOT eligible for discount
  const extendedSurcharge = getExtendedTimeSurcharge(printTimeHours);
  if (extendedSurcharge > 0) {
    const extraHours = printTimeHours - EXTENDED_TIME_THRESHOLD_HOURS;
    lineItems.push({
      label: 'Extended Print Time',
      amount: extendedSurcharge,
      details: `${extraHours.toFixed(1)}h × ${formatCad(EXTENDED_TIME_SURCHARGE_PER_HOUR)}/h`,
      type: 'labor',
      eligibleForMemberDiscount: false,
    });
  }
  
  // Post-processing - ELIGIBLE for discount
  const ppCost = getPostProcessingCost(postProcessing.id, postProcessing.hours);
  if (ppCost.customer > 0) {
    const ppOption = POST_PROCESSING_OPTIONS.find(o => o.id === postProcessing.id);
    lineItems.push({
      label: `Post-Processing (${ppOption?.label})`,
      amount: ppCost.customer,
      details: `${postProcessing.hours}h × ${formatCad(ppOption?.ratePerHour || 0)}/h`,
      type: 'labor',
      eligibleForMemberDiscount: true,
    });
    eligibleSubtotal += ppCost.customer;
  }
  
  // Designer royalty - NOT eligible for discount
  lineItems.push({
    label: 'Designer Royalty',
    amount: DESIGNER_ROYALTY,
    type: 'fee',
    eligibleForMemberDiscount: false,
  });
  
  // Calculate subtotal for single unit
  const unitSubtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  
  // Apply quantity multiplier
  let subtotal = unitSubtotal * qty;
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
      eligibleForMemberDiscount: false,
    });
    // Also reduce eligible subtotal proportionally
    eligibleSubtotal = eligibleSubtotal * (1 - discountRate);
  }
  
  subtotal -= quantityDiscount;
  
  // Minimum order adjustment - NOT eligible for discount
  let minimumAdjustment = 0;
  if (subtotal < MINIMUM_ORDER_TOTAL) {
    minimumAdjustment = MINIMUM_ORDER_TOTAL - subtotal;
    lineItems.push({
      label: 'Minimum Order Adjustment',
      amount: minimumAdjustment,
      details: `Min. ${formatCad(MINIMUM_ORDER_TOTAL)}`,
      type: 'adjustment',
      eligibleForMemberDiscount: false,
    });
  }
  
  const total = subtotal + minimumAdjustment;
  
  // Calculate member discount (only on eligible subtotal)
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
    makerPayout,
  };
}
