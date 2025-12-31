/**
 * Credit Economy Configuration
 * 10 credits = $1 CAD (1 credit = $0.10 CAD)
 */

// Core conversion constants
export const CREDITS_PER_CAD = 10;
export const CAD_PER_CREDIT = 0.1;

// Points earn rate (separate from credits)
export const POINTS_PER_CAD_SPENT = 10;

/**
 * Convert CAD to credits (returns integer)
 */
export function cadToCredits(cad: number): number {
  return Math.round(cad * CREDITS_PER_CAD);
}

/**
 * Convert credits to CAD (returns 2 decimal places)
 */
export function creditsToCad(credits: number): number {
  return Math.round(credits * CAD_PER_CREDIT * 100) / 100;
}

/**
 * Format credits for display (e.g., "1,490 credits")
 */
export function formatCredits(n: number): string {
  return `${n.toLocaleString()} credits`;
}

/**
 * Format CAD for display (e.g., "$149.00 CAD")
 */
export function formatCad(n: number): string {
  return `$${n.toFixed(2)} CAD`;
}

/**
 * Format credits with CAD equivalent in secondary text
 */
export function formatCreditsWithCad(credits: number): { primary: string; secondary: string } {
  return {
    primary: formatCredits(credits),
    secondary: `≈ ${formatCad(creditsToCad(credits))}`
  };
}
