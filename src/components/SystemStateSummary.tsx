/**
 * @fileoverview SystemStateSummary component for displaying overall system state.
 * 
 * This component displays the overall cognitive-emotional system state with
 * appropriate visual styling and accessible descriptions.
 */

import React from 'react';
import type { SystemStateSummaryProps } from '../types';
import { SYSTEM_STATE_DESCRIPTIONS, SYSTEM_STATE_COLORS } from '../lib/stability';

/**
 * Returns a background color class for the system state.
 * 
 * @param state - The current system state
 * @returns A Tailwind CSS background color class
 */
function getStateBackgroundClass(state: SystemStateSummaryProps['state']): string {
  switch (state) {
    case 'fractured':
      return 'bg-red-50 border-red-200';
    case 'critical':
      return 'bg-orange-50 border-orange-200';
    case 'narrowed':
      return 'bg-yellow-50 border-yellow-200';
    case 'stable':
      return 'bg-green-50 border-green-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}

/**
 * Returns a human-readable label for the system state.
 * 
 * @param state - The current system state
 * @returns A capitalized state label
 */
function getStateLabel(state: SystemStateSummaryProps['state']): string {
  return state.charAt(0).toUpperCase() + state.slice(1);
}

/**
 * SystemStateSummary displays the overall cognitive-emotional system state.
 * 
 * States and their meanings:
 * - **Stable**: Optimal functioning with full capacity
 * - **Narrowed**: Reduced capacity, functioning with limitations
 * - **Critical**: Significant impairment, limited processing
 * - **Fractured**: Severe impairment, fragmented processing
 * 
 * The component uses color coding (with text labels for colorblind accessibility)
 * and detailed descriptions to communicate system status.
 * 
 * @param props - Component props
 * @param props.state - Current system state
 * 
 * @example
 * ```tsx
 * <SystemStateSummary state="stable" />    // Green background, "Stable" label
 * <SystemStateSummary state="critical" />  // Orange background, "Critical" label
 * ```
 */
export function SystemStateSummary({
  state,
}: SystemStateSummaryProps): React.ReactElement {
  const backgroundClass = getStateBackgroundClass(state);
  const colorClass = SYSTEM_STATE_COLORS[state];
  const description = SYSTEM_STATE_DESCRIPTIONS[state];
  const label = getStateLabel(state);

  return (
    <div
      className={`p-4 border rounded-lg ${backgroundClass}`}
      role="status"
      aria-label={`System state: ${label}`}
    >
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Overall System State
      </h3>
      
      <p
        className={`text-2xl font-bold ${colorClass}`}
        aria-live="polite"
      >
        {label}
      </p>
      
      <p className="mt-2 text-sm text-gray-700">
        {description}
      </p>
    </div>
  );
}

export default SystemStateSummary;
