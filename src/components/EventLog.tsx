/**
 * @fileoverview EventLog component for displaying experimental event history.
 * 
 * This component provides an optional, scrollable event log that tracks
 * state transitions in the Cognitive Stability System. It displays
 * timestamps, previous and next states, and saturation levels.
 */

import React from 'react';
import type { EventLogEntry } from '../types';

/**
 * Props for the EventLog component.
 */
export interface EventLogProps {
  /**
   * Array of event log entries to display.
   */
  entries: EventLogEntry[];
}

/**
 * Formats an ISO timestamp to a human-readable time string.
 * 
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string (HH:MM:SS)
 */
function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return timestamp;
  }
}

/**
 * Displays an experimental event log of state transitions.
 * 
 * This component shows a scrollable list of events that occurred in the
 * Cognitive Stability System. Each entry displays:
 * - Timestamp of the transition
 * - Previous and next system states
 * - Saturation level at the time of transition
 * 
 * The event log is labeled as "Experimental" to indicate it is an
 * optional feature that may be refined in future versions.
 * 
 * @param props - Component props
 * @returns The rendered EventLog component
 * 
 * @example
 * <EventLog entries={events} />
 */
export function EventLog({ entries }: EventLogProps): React.ReactElement {
  return (
    <div
      className="event-log p-4 bg-gray-50 rounded-lg border border-gray-200"
      role="log"
      aria-label="Experimental Event Log"
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <span>Experimental Event Log</span>
        <span className="text-xs font-normal text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
          {entries.length} events
        </span>
      </h3>

      {entries.length === 0 ? (
        <p className="text-xs text-gray-500 italic">
          No events recorded. State transitions will appear here.
        </p>
      ) : (
        <div
          className="max-h-40 overflow-y-auto space-y-1"
          tabIndex={0}
          aria-label="Scrollable event list"
        >
          {entries.map((entry, index) => (
            <div
              key={`${entry.timestamp}-${index}`}
              className="text-xs font-mono p-2 bg-white rounded border border-gray-100"
            >
              <span className="text-gray-500">
                [{formatTimestamp(entry.timestamp)}]
              </span>{' '}
              <span className="text-blue-600">{entry.prevState}</span>
              <span className="text-gray-400"> → </span>
              <span className="text-purple-600">{entry.nextState}</span>
              <span className="text-gray-400"> @ </span>
              <span className="text-green-600">{entry.saturation}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventLog;
