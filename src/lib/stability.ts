/**
 * @fileoverview Stability calculation utilities for the Cognitive Stability System.
 * 
 * This module provides pure, deterministic functions for calculating integrity
 * metrics and system states within the dual-invariant cognitive/emotional architecture.
 * 
 * The CognitiveStabilitySystem models the relationship between emotional saturation
 * and cognitive integrity, following the principles of the Emotional Infrastructure™
 * framework.
 */

/**
 * Represents the integrity levels for both cognitive (CoC) and emotional (ERG)
 * subsystems of the dual-invariant architecture.
 * 
 * @property coc - Chain of Custody integrity (0-100)
 * @property erg - Emotional Regulation Graph integrity (0-100)
 */
export interface Integrity {
  /** Chain of Custody integrity percentage (0-100) */
  coc: number;
  /** Emotional Regulation Graph integrity percentage (0-100) */
  erg: number;
}

/**
 * Represents the overall system state derived from integrity calculations.
 * 
 * The system can be in one of four states based on the minimum integrity level:
 * - `fractured`: Critical failure state, minimum integrity < 20
 * - `critical`: Severe degradation, minimum integrity >= 20 and < 40
 * - `narrowed`: Reduced capacity, minimum integrity >= 40 and < 80
 * - `stable`: Optimal functioning, minimum integrity >= 80
 */
export type SystemState = 'fractured' | 'critical' | 'narrowed' | 'stable';

/**
 * Clamps a numeric value to a specified range.
 * 
 * @param value - The value to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value within [min, max]
 * 
 * @example
 * clamp(150, 0, 100) // Returns 100
 * clamp(-10, 0, 100) // Returns 0
 * clamp(50, 0, 100)  // Returns 50
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculates cognitive and emotional integrity values from a saturation level.
 * 
 * This function models the dual-invariant relationship where:
 * - CoC (Chain of Custody) integrity decreases as saturation increases
 * - ERG (Emotional Regulation Graph) integrity increases as saturation increases
 * 
 * Both values are clamped to the valid range of 0-100.
 * 
 * @param saturation - The current emotional saturation level (0-100)
 * @returns An Integrity object with calculated coc and erg values
 * 
 * @example
 * calculateIntegrity(20) // Returns { coc: 80, erg: 20 }
 * calculateIntegrity(50) // Returns { coc: 50, erg: 50 }
 * calculateIntegrity(80) // Returns { coc: 20, erg: 80 }
 */
export function calculateIntegrity(saturation: number): Integrity {
  const clampedSaturation = clamp(saturation, 0, 100);
  return {
    coc: clamp(100 - clampedSaturation, 0, 100),
    erg: clamp(clampedSaturation, 0, 100),
  };
}

/**
 * Determines the overall system state based on integrity levels.
 * 
 * The state is derived from the minimum of CoC and ERG integrity:
 * - fractured: minIntegrity < 20 (critical failure)
 * - critical: minIntegrity >= 20 && < 40 (severe degradation)
 * - narrowed: minIntegrity >= 40 && < 80 (reduced capacity)
 * - stable: minIntegrity >= 80 (optimal functioning)
 * 
 * @param integrity - The current integrity levels
 * @returns The system state classification
 * 
 * @example
 * getSystemState({ coc: 90, erg: 10 }) // Returns 'fractured'
 * getSystemState({ coc: 60, erg: 40 }) // Returns 'narrowed'
 * getSystemState({ coc: 50, erg: 50 }) // Returns 'narrowed'
 * getSystemState({ coc: 85, erg: 85 }) // Returns 'stable'
 */
export function getSystemState(integrity: Integrity): SystemState {
  const minIntegrity = Math.min(integrity.coc, integrity.erg);

  if (minIntegrity < 20) {
    return 'fractured';
  }
  if (minIntegrity < 40) {
    return 'critical';
  }
  if (minIntegrity < 80) {
    return 'narrowed';
  }
  return 'stable';
}

/**
 * Determines whether the cognitive and emotional subsystems are coupled.
 * 
 * Coupling occurs when both integrity values are above a specified threshold,
 * indicating synchronized operation between the Chain of Custody and
 * Emotional Regulation Graph subsystems.
 * 
 * @param integrity - The current integrity levels
 * @param threshold - The minimum integrity value for coupling (default: 20)
 * @returns True if both subsystems are coupled (both above threshold)
 * 
 * @example
 * isCoupled({ coc: 25, erg: 75 })     // Returns true (both >= 20)
 * isCoupled({ coc: 15, erg: 85 })     // Returns false (coc < 20)
 * isCoupled({ coc: 50, erg: 50 }, 40) // Returns true (both >= 40)
 */
export function isCoupled(integrity: Integrity, threshold = 20): boolean {
  return integrity.coc >= threshold && integrity.erg >= threshold;
}
