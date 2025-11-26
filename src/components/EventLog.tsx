/**
 * EventLog Component
 *
 * Optional experimental event log that displays state transition
 * history in the Dual-Invariant cognitive architecture.
 *
 * @module EventLog
 */

import React from 'react';
import type { EventLogProps } from '../types';

/**
 * Formats a timestamp for display.
 *
 * @param isoTimestamp - ISO timestamp string
 * @returns Formatted time string
 */
function formatTimestamp(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Displays an optional scrollable event log of state transitions.
 *
 * This is an experimental feature that records system state changes
 * over time. Each entry shows the timestamp, previous and next state,
 * and the saturation level at the time of transition.
 *
 * The event log is off by default and must be explicitly enabled
 * via the `enableEventLog` prop on the parent CognitiveStabilitySystem.
 *
 * @param props - Component props
 * @returns The rendered event log panel
 *
 * @example
 * ```tsx
 * <EventLog events={[
 *   {
 *     timestamp: '2024-01-15T10:30:00Z',
 *     previousState: 'stable',
 *     nextState: 'narrowed',
 *     saturation: 25
 *   }
 * ]} />
 * ```
 */
export function EventLog({ events }: EventLogProps): React.ReactElement {
  return (
    <div className="event-log p-4 border rounded-lg bg-slate-50">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Experimental Event Log
      </h3>

      <p className="text-xs text-slate-500 mb-3">
        Records state transitions with timestamps, previous→next state, and
        saturation level.
      </p>

      <div
        className="max-h-40 overflow-y-auto border border-slate-200 rounded bg-white"
        role="log"
        aria-live="polite"
        aria-label="State transition event log"
      >
        {events.length === 0 ? (
          <p className="p-3 text-sm text-slate-400 italic">
            No state transitions recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {events.map((event, index) => (
              <li
                key={`${event.timestamp}-${index}`}
                className="p-2 text-xs font-mono"
              >
                <span className="text-slate-500">
                  [{formatTimestamp(event.timestamp)}]
                </span>{' '}
                <span className="text-slate-700">
                  {event.previousState} → {event.nextState}
                </span>{' '}
                <span className="text-slate-400">
                  (sat: {event.saturation}%)
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
