/**
 * Tolerance window tracking for emotional signals
 * 
 * Manages baseline and variance tracking for emotional signal monitoring.
 */

export interface ToleranceWindow {
  baseline: number;
  variance: number;
  timestamp: number;
}

/**
 * Creates a new tolerance window
 * @param baseline The baseline value
 * @param variance The acceptable variance
 * @returns A tolerance window object
 */
export function createToleranceWindow(baseline: number, variance: number): ToleranceWindow {
  return {
    baseline,
    variance,
    timestamp: Date.now(),
  };
}

/**
 * Checks if a value is within the tolerance window
 * @param value The value to check
 * @param window The tolerance window
 * @returns True if value is within tolerance, false otherwise
 */
export function isWithinTolerance(value: number, window: ToleranceWindow): boolean {
  const lowerBound = window.baseline - window.variance;
  const upperBound = window.baseline + window.variance;
  return value >= lowerBound && value <= upperBound;
}
