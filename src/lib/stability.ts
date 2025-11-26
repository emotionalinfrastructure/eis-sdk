/**
 * Stability Module for the Cognitive Stability System
 *
 * This module provides pure, deterministic functions for computing
 * cognitive and emotional integrity in the Dual-Invariant framework.
 * All functions are free of side effects and return predictable results
 * based solely on their inputs.
 *
 * @module stability
 */

/**
 * Represents the integrity levels of a cognitive or emotional subsystem.
 * The min/max values reflect the range of adaptive capacity.
 */
export interface Integrity {
  /** The minimum integrity level (0-100 scale) */
  min: number;
  /** The maximum integrity level (0-100 scale) */
  max: number;
}

/**
 * Possible system states derived from integrity calculations.
 * These states reflect the health of the cognitive/emotional architecture.
 */
export type SystemState = 'fractured' | 'critical' | 'narrowed' | 'stable';

/**
 * Clamps a value to the range [0, 100].
 *
 * Used to ensure saturation and integrity values remain within valid bounds.
 *
 * @param value - The numeric value to clamp
 * @returns The clamped value between 0 and 100
 *
 * @example
 * ```ts
 * clamp(-5);  // Returns 0
 * clamp(50);  // Returns 50
 * clamp(150); // Returns 100
 * ```
 */
export function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Calculates the integrity range based on saturation level.
 *
 * In the Dual-Invariant cognitive architecture, saturation represents
 * the current load or stress on the system. This function derives
 * the integrity bounds based on the inverse relationship between
 * saturation and cognitive/emotional capacity.
 *
 * @param saturation - The saturation level (0-100 scale)
 * @returns An Integrity object with min/max values
 *
 * @example
 * ```ts
 * calculateIntegrity(20);  // Returns { min: 80, max: 100 }
 * calculateIntegrity(50);  // Returns { min: 50, max: 100 }
 * calculateIntegrity(100); // Returns { min: 0, max: 100 }
 * ```
 */
export function calculateIntegrity(saturation: number): Integrity {
  const clampedSaturation = clamp(saturation);
  const minIntegrity = clamp(100 - clampedSaturation);
  return {
    min: minIntegrity,
    max: 100,
  };
}

/**
 * Determines the system state based on minimum integrity.
 *
 * The state thresholds reflect cognitive resilience categories:
 * - **fractured**: minIntegrity < 20 — system coherence is compromised
 * - **critical**: minIntegrity >= 20 && < 40 — requires immediate attention
 * - **narrowed**: minIntegrity >= 40 && < 80 — reduced adaptive capacity
 * - **stable**: minIntegrity >= 80 — full cognitive/emotional integration
 *
 * @param integrity - The integrity object with min/max values
 * @returns The corresponding SystemState
 *
 * @example
 * ```ts
 * getSystemState({ min: 10, max: 100 }); // Returns 'fractured'
 * getSystemState({ min: 30, max: 100 }); // Returns 'critical'
 * getSystemState({ min: 60, max: 100 }); // Returns 'narrowed'
 * getSystemState({ min: 90, max: 100 }); // Returns 'stable'
 * ```
 */
export function getSystemState(integrity: Integrity): SystemState {
  const { min: minIntegrity } = integrity;

  if (minIntegrity < 20) {
    return 'fractured';
  } else if (minIntegrity < 40) {
    return 'critical';
  } else if (minIntegrity < 80) {
    return 'narrowed';
  } else {
    return 'stable';
  }
}

/**
 * Determines if the system is in a coupled state.
 *
 * A "coupled" state indicates that cognitive and emotional subsystems
 * are operating in sync with each other. When integrity drops below
 * the coupling threshold, the systems may begin to decouple, leading
 * to misalignment between cognitive processing and emotional response.
 *
 * @param integrity - The integrity object with min/max values
 * @param threshold - The coupling threshold (default: 20)
 * @returns True if the system is coupled (integrity >= threshold)
 *
 * @example
 * ```ts
 * isCoupled({ min: 50, max: 100 });       // Returns true
 * isCoupled({ min: 15, max: 100 });       // Returns false
 * isCoupled({ min: 25, max: 100 }, 30);   // Returns false (custom threshold)
 * ```
 */
export function isCoupled(integrity: Integrity, threshold = 20): boolean {
  return integrity.min >= threshold;
}
