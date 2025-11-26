/**
 * CognitiveStabilitySystem Component
 *
 * The main parent component that composes all subcomponents of the
 * Dual-Invariant cognitive-emotional architecture visualization.
 *
 * This component manages the saturation state and derives all other
 * values (integrity, system state, coupling status) from it using
 * pure helper functions.
 *
 * @module CognitiveStabilitySystem
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type {
  CognitiveStabilitySystemProps,
  StateChangeEvent,
} from '../types';
import type { SystemState } from '../lib/stability';
import {
  clamp,
  calculateIntegrity,
  getSystemState,
  isCoupled,
} from '../lib/stability';

import { SaturationInputPanel } from './SaturationInputPanel';
import { CognitionPanel } from './CognitionPanel';
import { EmotionPanel } from './EmotionPanel';
import { CoupledStateLock } from './CoupledStateLock';
import { SystemStateSummary } from './SystemStateSummary';
import { FrameworkNotes } from './FrameworkNotes';
import { EventLog } from './EventLog';

/**
 * Default initial saturation level.
 */
const DEFAULT_INITIAL_SATURATION = 20;

/**
 * Main component for the Dual-Invariant Cognitive Stability System.
 *
 * Composes all visualization panels and manages the reactive state
 * of the cognitive-emotional system. Saturation changes drive updates
 * to integrity calculations, system state, and coupling status.
 *
 * Features:
 * - Controlled saturation input with accessible slider and buttons
 * - Real-time integrity visualization for CoC and ERG subsystems
 * - Coupled/uncoupled state indicator
 * - Overall system state summary with color coding
 * - Optional experimental event log for state transition tracking
 * - Full ARIA accessibility support
 *
 * @param props - Component props
 * @returns The rendered cognitive stability system
 *
 * @example
 * ```tsx
 * // Basic usage with defaults
 * <CognitiveStabilitySystem />
 *
 * // With custom initial saturation
 * <CognitiveStabilitySystem initialSaturation={50} />
 *
 * // With event logging enabled
 * <CognitiveStabilitySystem enableEventLog={true} />
 *
 * // Full configuration
 * <CognitiveStabilitySystem
 *   initialSaturation={30}
 *   enableEventLog={true}
 * />
 * ```
 */
export function CognitiveStabilitySystem({
  initialSaturation = DEFAULT_INITIAL_SATURATION,
  enableEventLog = false,
}: CognitiveStabilitySystemProps): React.ReactElement {
  // Core state
  const [saturation, setSaturation] = useState<number>(
    clamp(initialSaturation)
  );
  const [events, setEvents] = useState<StateChangeEvent[]>([]);

  // Derived values
  const integrity = calculateIntegrity(saturation);
  const systemState = getSystemState(integrity);
  const coupled = isCoupled(integrity);

  // Track previous state for event logging
  const previousStateRef = useRef<SystemState>(systemState);

  // Handle saturation changes
  const handleSaturationChange = useCallback((newSaturation: number) => {
    setSaturation(clamp(newSaturation));
  }, []);

  // Log state transitions when event logging is enabled
  useEffect(() => {
    if (enableEventLog && systemState !== previousStateRef.current) {
      const newEvent: StateChangeEvent = {
        timestamp: new Date().toISOString(),
        previousState: previousStateRef.current,
        nextState: systemState,
        saturation,
      };

      setEvents((prev) => [...prev, newEvent]);
      previousStateRef.current = systemState;
    }
  }, [enableEventLog, systemState, saturation]);

  return (
    <div
      className="cognitive-stability-system max-w-2xl mx-auto p-6 space-y-6"
      role="application"
      aria-label="Dual-Invariant Cognitive Stability System"
    >
      <header className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Dual-Invariant Cognitive Stability System
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Visualizing cognitive-emotional integrity and coupling
        </p>
      </header>

      {/* Saturation Input */}
      <SaturationInputPanel
        saturation={saturation}
        onSaturationChange={handleSaturationChange}
      />

      {/* Dual Invariant Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CognitionPanel integrity={integrity} state={systemState} />
        <EmotionPanel integrity={integrity} state={systemState} />
      </div>

      {/* Coupling Status */}
      <CoupledStateLock isCoupled={coupled} />

      {/* System State Summary */}
      <SystemStateSummary state={systemState} />

      {/* Framework Notes */}
      <FrameworkNotes />

      {/* Optional Event Log */}
      {enableEventLog && <EventLog events={events} />}
    </div>
  );
}

export default CognitiveStabilitySystem;
