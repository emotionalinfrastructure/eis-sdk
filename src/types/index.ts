/**
 * @fileoverview Shared types for the Cognitive Stability System components.
 * 
 * This module exports TypeScript interfaces and types used across
 * the CognitiveStabilitySystem component hierarchy.
 */

import type { Integrity, SystemState } from '../lib/stability';

/**
 * Props for the CognitiveStabilitySystem parent component.
 * 
 * This component manages the overall cognitive stability visualization,
 * allowing users to adjust saturation levels and observe the resulting
 * effects on system integrity and state.
 */
export interface CognitiveStabilitySystemProps {
  /**
   * Initial saturation level (0-100).
   * Defaults to 50 if not provided.
   */
  initialSaturation?: number;
  
  /**
   * When true, enables an event log that records state changes.
   * Defaults to false.
   */
  enableEventLog?: boolean;
}

/**
 * Props for the SaturationInputPanel component.
 */
export interface SaturationInputPanelProps {
  /** Current saturation value (0-100) */
  saturation: number;
  /** Callback fired when saturation changes */
  onSaturationChange: (value: number) => void;
}

/**
 * Props for the CognitionPanel component.
 * Displays the Cognitive Operations Center (CoC) integrity.
 */
export interface CognitionPanelProps {
  /** Current integrity values */
  integrity: Integrity;
}

/**
 * Props for the EmotionPanel component.
 * Displays the Emotional Regulatory Gland (ERG) integrity.
 */
export interface EmotionPanelProps {
  /** Current integrity values */
  integrity: Integrity;
}

/**
 * Props for the CoupledStateLock component.
 * Displays whether the cognitive-emotional system is coupled or uncoupled.
 */
export interface CoupledStateLockProps {
  /** Whether the system is in a coupled state */
  isCoupled: boolean;
}

/**
 * Props for the SystemStateSummary component.
 * Displays the overall system state with description.
 */
export interface SystemStateSummaryProps {
  /** Current system state */
  state: SystemState;
}

/**
 * Props for the EventLog component.
 * Displays a log of state change events.
 */
export interface EventLogProps {
  /** Array of event messages to display */
  events: string[];
}

/**
 * Represents a state change event for the event log.
 */
export interface StateChangeEvent {
  /** Timestamp of the event */
  timestamp: Date;
  /** Description of the state change */
  message: string;
}

// Re-export types from stability module for convenience
export type { Integrity, SystemState } from '../lib/stability';
