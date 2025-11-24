/**
 * Trust delta calculations
 * 
 * Calculates trust deltas and repair metrics for behavioral signal sovereignty.
 */

export interface TrustMetrics {
  baseline: number;
  current: number;
  delta: number;
}

/**
 * Calculates the trust delta
 * @param baseline The baseline trust value
 * @param current The current trust value
 * @returns Trust metrics including delta
 */
export function calculateTrustDelta(baseline: number, current: number): TrustMetrics {
  // Handle edge cases
  if (baseline === 0 && current === 0) {
    return { baseline, current, delta: 0 };
  }
  
  const delta = current - baseline;
  
  return {
    baseline,
    current,
    delta,
  };
}
