/**
 * @fileoverview EventLog component for displaying state change events.
 * 
 * This component provides an optional event log that records and displays
 * state changes in the Cognitive Stability System. It is opt-in and only
 * rendered when enableEventLog is true.
 */

import React from 'react';
import type { EventLogProps } from '../types';

/**
 * EventLog displays a scrollable log of state change events.
 * 
 * This component provides:
 * - A scrollable list of recent events
 * - Accessible labeling for screen readers
 * - Visual separation between events
 * 
 * Events are displayed in reverse chronological order (newest first).
 * 
 * @param props - Component props
 * @param props.events - Array of event message strings
 * 
 * @example
 * ```tsx
 * <EventLog events={[
 *   "10:30:15 - State changed to stable",
 *   "10:30:10 - State changed to narrowed"
 * ]} />
 * ```
 */
export function EventLog({
  events,
}: EventLogProps): React.ReactElement {
  if (events.length === 0) {
    return (
      <div
        className="p-4 border border-gray-200 rounded-lg bg-white"
        role="log"
        aria-label="Event log"
      >
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Event Log
        </h3>
        <p className="text-sm text-gray-500 italic">
          No events recorded yet
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg bg-white"
      role="log"
      aria-label="Event log"
      aria-live="polite"
    >
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Event Log
      </h3>
      
      <ul
        className="max-h-40 overflow-y-auto space-y-1 text-xs font-mono"
        aria-label="Event list"
      >
        {events.map((event, index) => (
          <li
            key={`event-${events.length - index}`}
            className="py-1 px-2 bg-gray-50 rounded text-gray-700"
          >
            {event}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventLog;
