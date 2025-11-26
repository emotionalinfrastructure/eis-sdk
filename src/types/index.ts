/**
 * @fileoverview Shared type definitions for the Cognitive Stability System.
 * 
 * This module exports common types and interfaces used across the
 * dual-invariant cognitive/emotional architecture components.
 */

// Re-export types from stability library
export type { Integrity, SystemState } from '../lib/stability';

/**
 * Represents a logged event in the experimental event log.
 * 
 * Events are recorded when the system state transitions between states,
 * capturing the timestamp, previous and next states, and the saturation
 * level at the time of transition.
 */
export interface EventLogEntry {
  /** ISO timestamp of when the event occurred */
  timestamp: string;
  /** The system state before the transition */
  prevState: string;
  /** The system state after the transition */
  nextState: string;
  /** The saturation level at the time of transition (0-100) */
  saturation: number;
}

/**
 * Props for the CognitiveStabilitySystem component.
 * 
 * The CognitiveStabilitySystem is the main parent component that composes
 * all subcomponents for the dual-invariant cognitive/emotional architecture
 * visualization.
 */
export interface CognitiveStabilitySystemProps {
  /**
   * Initial saturation level (0-100).
   * Determines the starting point for the saturation slider.
   * @default 20
   */
  initialSaturation?: number;

  /**
   * Whether to enable the experimental event log.
   * When enabled, state transitions are logged with timestamps.
   * @default false
   */
  enableEventLog?: boolean;
}
