/**
 * Shared Types for the Cognitive Stability System
 *
 * This module exports common type definitions used across
 * components in the Dual-Invariant cognitive architecture.
 *
 * @module types
 */

import type { Integrity, SystemState } from '../lib/stability';

// Re-export stability types for convenience
export type { Integrity, SystemState };

/**
 * Props for the CognitiveStabilitySystem parent component.
 *
 * These props configure the initial state and behavior of the
 * Dual-Invariant visualization system.
 */
export interface CognitiveStabilitySystemProps {
  /**
   * The initial saturation level (0-100).
   * Higher saturation means lower integrity/capacity.
   * @default 20
   */
  initialSaturation?: number;

  /**
   * Whether to enable the experimental event log.
   * When enabled, state transitions are recorded with timestamps.
   * @default false
   */
  enableEventLog?: boolean;
}

/**
 * Represents a logged event when system state changes.
 * Used by the EventLog component when event logging is enabled.
 */
export interface StateChangeEvent {
  /** ISO timestamp of the state change */
  timestamp: string;

  /** The system state before the change */
  previousState: SystemState;

  /** The system state after the change */
  nextState: SystemState;

  /** The saturation level at the time of the change */
  saturation: number;
}

/**
 * Props for the SaturationInputPanel component.
 */
export interface SaturationInputPanelProps {
  /** Current saturation value (0-100) */
  saturation: number;

  /** Callback when saturation changes */
  onSaturationChange: (saturation: number) => void;
}

/**
 * Props for the CognitionPanel component.
 */
export interface CognitionPanelProps {
  /** The current integrity values */
  integrity: Integrity;

  /** The current system state */
  state: SystemState;
}

/**
 * Props for the EmotionPanel component.
 */
export interface EmotionPanelProps {
  /** The current integrity values */
  integrity: Integrity;

  /** The current system state */
  state: SystemState;
}

/**
 * Props for the CoupledStateLock component.
 */
export interface CoupledStateLockProps {
  /** Whether the system is currently coupled */
  isCoupled: boolean;
}

/**
 * Props for the SystemStateSummary component.
 */
export interface SystemStateSummaryProps {
  /** The current system state */
  state: SystemState;
}

/**
 * Props for the EventLog component.
 */
export interface EventLogProps {
  /** Array of state change events to display */
  events: StateChangeEvent[];
}
