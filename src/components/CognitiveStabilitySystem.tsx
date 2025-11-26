/**
 * @fileoverview CognitiveStabilitySystem component for the dual-invariant architecture.
 * 
 * This is the main parent component that composes all subcomponents for
 * visualizing and interacting with the Cognitive Stability System. It
 * manages saturation state, computes integrity via calculateIntegrity,
 * derives system state via getSystemState, and records events when
 * the experimental event log is enabled.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { CognitiveStabilitySystemProps, EventLogEntry } from '../types';
import { calculateIntegrity, getSystemState, isCoupled } from '../lib/stability';
import { SaturationInputPanel } from './SaturationInputPanel';
import { CognitionPanel } from './CognitionPanel';
import { EmotionPanel } from './EmotionPanel';
import { CoupledStateLock } from './CoupledStateLock';
import { SystemStateSummary } from './SystemStateSummary';
import { FrameworkNotes } from './FrameworkNotes';
import { EventLog } from './EventLog';

/**
 * The main Cognitive Stability System component.
 * 
 * This component implements the dual-invariant cognitive/emotional architecture
 * visualization. It provides:
 * 
 * - A saturation input panel for adjusting emotional saturation (0-100)
 * - Cognition panel showing CoC (Chain of Custody) integrity
 * - Emotion panel showing ERG (Emotional Regulation Graph) integrity
 * - Coupled state indicator showing subsystem synchronization
 * - System state summary with overall health classification
 * - Framework notes explaining the architecture
 * - Optional experimental event log for tracking state transitions
 * 
 * The component uses ARIA live regions to announce dynamic changes
 * for accessibility compliance.
 * 
 * @param props - Component props
 * @param props.initialSaturation - Initial saturation level (default: 20)
 * @param props.enableEventLog - Whether to show the event log (default: false)
 * @returns The rendered CognitiveStabilitySystem component
 * 
 * @example
 * // Basic usage
 * <CognitiveStabilitySystem />
 * 
 * @example
 * // With custom initial saturation
 * <CognitiveStabilitySystem initialSaturation={50} />
 * 
 * @example
 * // With event log enabled
 * <CognitiveStabilitySystem enableEventLog={true} />
 */
export function CognitiveStabilitySystem({
  initialSaturation = 20,
  enableEventLog = false,
}: CognitiveStabilitySystemProps): React.ReactElement {
  const [saturation, setSaturation] = useState(initialSaturation);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  
  // Track previous state for event logging
  const prevStateRef = useRef<string | null>(null);

  // Calculate derived values
  const integrity = calculateIntegrity(saturation);
  const systemState = getSystemState(integrity);
  const coupled = isCoupled(integrity);

  // Log state transitions when event log is enabled
  useEffect(() => {
    if (!enableEventLog) return;

    const currentState = systemState;
    const prevState = prevStateRef.current;

    // Only log when state actually changes (not on initial render)
    if (prevState !== null && prevState !== currentState) {
      const newEntry: EventLogEntry = {
        timestamp: new Date().toISOString(),
        prevState,
        nextState: currentState,
        saturation,
      };
      setEventLog((prev) => [...prev, newEntry]);
    }

    prevStateRef.current = currentState;
  }, [enableEventLog, systemState, saturation]);

  const handleSaturationChange = useCallback((value: number) => {
    setSaturation(value);
  }, []);

  return (
    <div
      className="cognitive-stability-system max-w-2xl mx-auto p-6 space-y-6"
      role="application"
      aria-label="Cognitive Stability System"
    >
      <header className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Cognitive Stability System
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Dual-Invariant Architecture Visualization
        </p>
      </header>

      <SaturationInputPanel
        value={saturation}
        onChange={handleSaturationChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CognitionPanel integrity={integrity.coc} />
        <EmotionPanel integrity={integrity.erg} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SystemStateSummary state={systemState} />
        </div>
        <CoupledStateLock isCoupled={coupled} />
      </div>

      <FrameworkNotes />

      {enableEventLog && <EventLog entries={eventLog} />}
    </div>
  );
}

export default CognitiveStabilitySystem;
