/**
 * @fileoverview Pure helper functions for cognitive stability calculations.
 * 
 * This module provides the core logic for computing integrity values and system states
 * based on saturation levels in the Emotional Infrastructure architecture.
 * 
 * The Cognitive Stability System models the relationship between emotional saturation
 * and cognitive integrity, using thresholds to determine system state.
 */

/**
 * Represents the integrity values for both the Emotional Regulatory Glands (ERG)
 * and Cognitive Operations Center (CoC).
 */
export interface Integrity {
  /** Emotional Regulatory Gland integrity (0-100) */
  erg: number;
  /** Cognitive Operations Center integrity (0-100) */
  coc: number;
}

/**
 * Represents the overall system state based on integrity thresholds.
 * 
 * States and their thresholds:
 * - `fractured`: integrity < 20 (severe impairment)
 * - `critical`: 20 <= integrity < 40 (significant impairment)
 * - `narrowed`: 40 <= integrity < 80 (reduced capacity)
 * - `stable`: integrity >= 80 (optimal functioning)
 */
export type SystemState = 'fractured' | 'critical' | 'narrowed' | 'stable';

/**
 * Clamps a numeric value within a specified range.
 * 
 * @param value - The value to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value, guaranteed to be within [min, max]
 * 
 * @example
 * ```typescript
 * clamp(150, 0, 100); // Returns 100
 * clamp(-10, 0, 100); // Returns 0
 * clamp(50, 0, 100);  // Returns 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates the integrity values for both ERG and CoC based on saturation level.
 * 
 * Integrity is computed as the inverse of saturation, representing how
 * cognitive and emotional systems maintain function under pressure.
 * Higher saturation leads to lower integrity (more impairment).
 * 
 * @param saturation - The current saturation level (0-100)
 * @returns An Integrity object with ERG and CoC values
 * 
 * @example
 * ```typescript
 * calculateIntegrity(70); // Returns { erg: 30, coc: 30 }
 * calculateIntegrity(20); // Returns { erg: 80, coc: 80 }
 * ```
 */
export function calculateIntegrity(saturation: number): Integrity {
  const clampedSaturation = clamp(saturation, 0, 100);
  const integrityValue = 100 - clampedSaturation;
  
  return {
    erg: integrityValue,
    coc: integrityValue,
  };
}

/**
 * Determines the system state based on integrity levels.
 * 
 * Uses the CoC (Cognitive Operations Center) integrity value to determine
 * the overall system state according to predefined thresholds:
 * - fractured: < 20 (severe cognitive/emotional impairment)
 * - critical: >= 20 and < 40 (significant impairment)  
 * - narrowed: >= 40 and < 80 (reduced capacity, functioning with limitations)
 * - stable: >= 80 (optimal cognitive/emotional functioning)
 * 
 * @param integrity - The integrity values to evaluate
 * @returns The corresponding SystemState
 * 
 * @example
 * ```typescript
 * getSystemState({ erg: 85, coc: 85 }); // Returns 'stable'
 * getSystemState({ erg: 50, coc: 50 }); // Returns 'narrowed'
 * getSystemState({ erg: 25, coc: 25 }); // Returns 'critical'
 * getSystemState({ erg: 10, coc: 10 }); // Returns 'fractured'
 * ```
 */
export function getSystemState(integrity: Integrity): SystemState {
  const { coc } = integrity;
  
  if (coc < 20) {
    return 'fractured';
  }
  if (coc < 40) {
    return 'critical';
  }
  if (coc < 80) {
    return 'narrowed';
  }
  return 'stable';
}

/**
 * Determines if the cognitive-emotional system is in a coupled state.
 * 
 * A coupled state indicates that ERG and CoC are operating in sync,
 * maintaining coherent processing. When integrity drops below the threshold,
 * the system becomes uncoupled, leading to fragmented processing.
 * 
 * @param integrity - The integrity values to evaluate
 * @param threshold - The minimum integrity required for coupling (default: 20)
 * @returns True if the system is coupled (coherent), false if uncoupled (fragmented)
 * 
 * @example
 * ```typescript
 * isCoupled({ erg: 50, coc: 50 });      // Returns true
 * isCoupled({ erg: 15, coc: 15 });      // Returns false (below default threshold)
 * isCoupled({ erg: 30, coc: 30 }, 40);  // Returns false (below custom threshold)
 * ```
 */
export function isCoupled(integrity: Integrity, threshold = 20): boolean {
  return integrity.coc >= threshold;
}

/**
 * System state descriptions for accessibility and UI display.
 */
export const SYSTEM_STATE_DESCRIPTIONS: Record<SystemState, string> = {
  fractured: 'Severe impairment - cognitive and emotional systems are fragmented',
  critical: 'Significant impairment - limited processing capacity',
  narrowed: 'Reduced capacity - functioning with limitations',
  stable: 'Optimal functioning - full cognitive and emotional capacity',
};

/**
 * Color class mappings for system states (Tailwind CSS classes).
 */
export const SYSTEM_STATE_COLORS: Record<SystemState, string> = {
  fractured: 'text-red-600',
  critical: 'text-orange-500',
  narrowed: 'text-yellow-500',
  stable: 'text-green-600',
};

/**
 * Returns a textual label describing the integrity level.
 * Used for accessibility and colorblind-friendly display.
 * 
 * @param value - The integrity value (0-100)
 * @returns A human-readable description of the integrity level
 * 
 * @example
 * ```typescript
 * getIntegrityLabel(85); // Returns 'Optimal'
 * getIntegrityLabel(10); // Returns 'Severely Impaired'
 * ```
 */
export function getIntegrityLabel(value: number): string {
  if (value < 20) {
    return 'Severely Impaired';
  }
  if (value < 40) {
    return 'Critically Low';
  }
  if (value < 60) {
    return 'Moderately Reduced';
  }
  if (value < 80) {
    return 'Slightly Reduced';
  }
  return 'Optimal';
}

/**
 * Returns a color class based on integrity level for accessibility.
 * Uses Tailwind CSS color classes.
 * 
 * @param value - The integrity value (0-100)
 * @returns A Tailwind CSS color class
 * 
 * @example
 * ```typescript
 * getIntegrityColorClass(85); // Returns 'text-green-600'
 * getIntegrityColorClass(10); // Returns 'text-red-600'
 * ```
 */
export function getIntegrityColorClass(value: number): string {
  if (value < 20) {
    return 'text-red-600';
  }
  if (value < 40) {
    return 'text-orange-500';
  }
  if (value < 60) {
    return 'text-yellow-600';
  }
  if (value < 80) {
    return 'text-yellow-500';
  }
  return 'text-green-600';
}
