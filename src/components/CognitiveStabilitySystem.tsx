/**
 * @fileoverview CognitiveStabilitySystem parent component.
 * 
 * This is the main component that orchestrates the Cognitive Stability System UI.
 * It manages the saturation state, computes integrity values, derives system state,
 * and optionally records events.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { CognitiveStabilitySystemProps } from '../types';
import { calculateIntegrity, getSystemState, isCoupled, clamp } from '../lib/stability';
import { SaturationInputPanel } from './SaturationInputPanel';
import { CognitionPanel } from './CognitionPanel';
import { EmotionPanel } from './EmotionPanel';
import { CoupledStateLock } from './CoupledStateLock';
import { SystemStateSummary } from './SystemStateSummary';
import { FrameworkNotes } from './FrameworkNotes';
import { EventLog } from './EventLog';

/**
 * Formats a timestamp for the event log.
 * 
 * @param date - The date to format
 * @returns A formatted time string (HH:MM:SS)
 */
function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * CognitiveStabilitySystem is the main component for visualizing cognitive stability.
 * 
 * This component provides:
 * - Interactive saturation control via slider and buttons
 * - Real-time display of ERG and CoC integrity values
 * - System state visualization (stable/narrowed/critical/fractured)
 * - Coupling status indicator
 * - Optional event logging for state changes
 * - Framework documentation and notes
 * 
 * The component models the relationship between emotional saturation and
 * cognitive-emotional integrity in the Emotional Infrastructure™ framework.
 * 
 * @param props - Component props
 * @param props.initialSaturation - Initial saturation level (0-100, default: 50)
 * @param props.enableEventLog - Whether to show the event log (default: false)
 * 
 * @example
 * ```tsx
 * // Basic usage with defaults
 * <CognitiveStabilitySystem />
 * 
 * // With custom initial saturation
 * <CognitiveStabilitySystem initialSaturation={30} />
 * 
 * // With event logging enabled
 * <CognitiveStabilitySystem enableEventLog={true} />
 * 
 * // Full configuration
 * <CognitiveStabilitySystem
 *   initialSaturation={25}
 *   enableEventLog={true}
 * />
 * ```
 */
export function CognitiveStabilitySystem({
  initialSaturation = 50,
  enableEventLog = false,
}: CognitiveStabilitySystemProps): React.ReactElement {
  // Clamp initial saturation to valid range
  const [saturation, setSaturation] = useState(() => clamp(initialSaturation, 0, 100));
  const [events, setEvents] = useState<string[]>([]);
  
  // Track previous state for change detection
  const prevStateRef = useRef<string | null>(null);
  
  // Compute derived values
  const integrity = calculateIntegrity(saturation);
  const systemState = getSystemState(integrity);
  const coupled = isCoupled(integrity);
  
  // Handle saturation changes
  const handleSaturationChange = useCallback((value: number) => {
    setSaturation(clamp(value, 0, 100));
  }, []);
  
  // Record events when state changes
  useEffect(() => {
    if (!enableEventLog) {
      return;
    }
    
    const currentState = `${systemState}-${coupled}`;
    
    if (prevStateRef.current !== null && prevStateRef.current !== currentState) {
      const timestamp = formatTimestamp(new Date());
      const coupledText = coupled ? 'coupled' : 'uncoupled';
      const message = `${timestamp} - State: ${systemState}, ${coupledText} (sat: ${saturation}%)`;
      
      setEvents((prev) => [message, ...prev].slice(0, 50)); // Keep last 50 events
    }
    
    prevStateRef.current = currentState;
  }, [systemState, coupled, saturation, enableEventLog]);
  
  return (
    <div
      className="max-w-4xl mx-auto p-6 space-y-6"
      role="application"
      aria-label="Cognitive Stability System"
    >
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Cognitive Stability System
        </h1>
        <p className="mt-2 text-gray-600">
          Emotional Infrastructure™ visualization
        </p>
      </header>
      
      {/* Input Controls */}
      <section aria-label="Saturation controls">
        <SaturationInputPanel
          saturation={saturation}
          onSaturationChange={handleSaturationChange}
        />
      </section>
      
      {/* Integrity Panels */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        aria-label="Integrity status"
      >
        <CognitionPanel integrity={integrity} />
        <EmotionPanel integrity={integrity} />
      </section>
      
      {/* System Status */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        aria-label="System status"
      >
        <SystemStateSummary state={systemState} />
        <CoupledStateLock isCoupled={coupled} />
      </section>
      
      {/* Optional Event Log */}
      {enableEventLog && (
        <section aria-label="Event history">
          <EventLog events={events} />
        </section>
      )}
      
      {/* Framework Notes */}
      <section aria-label="Documentation">
        <FrameworkNotes />
      </section>
    </div>
  );
}

export default CognitiveStabilitySystem;
