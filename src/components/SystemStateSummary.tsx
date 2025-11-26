/**
 * SystemStateSummary Component
 *
 * Displays the overall system state with descriptive labels
 * and appropriate color coding for quick visual assessment.
 *
 * @module SystemStateSummary
 */

import React from 'react';
import type { SystemStateSummaryProps } from '../types';
import type { SystemState } from '../lib/stability';

/**
 * State configuration for visual display.
 */
interface StateConfig {
  label: string;
  description: string;
  colorClass: string;
  bgClass: string;
}

/**
 * Maps system states to their display configurations.
 */
const stateConfigs: Record<SystemState, StateConfig> = {
  fractured: {
    label: 'Fractured',
    description:
      'System coherence is compromised. Immediate stabilization required.',
    colorClass: 'text-red-700',
    bgClass: 'bg-red-50 border-red-200',
  },
  critical: {
    label: 'Critical',
    description:
      'System under significant stress. Close monitoring recommended.',
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-50 border-orange-200',
  },
  narrowed: {
    label: 'Narrowed',
    description:
      'Reduced adaptive capacity. Some constraints on processing.',
    colorClass: 'text-yellow-700',
    bgClass: 'bg-yellow-50 border-yellow-200',
  },
  stable: {
    label: 'Stable',
    description:
      'Full cognitive and emotional integration. Optimal functioning.',
    colorClass: 'text-green-700',
    bgClass: 'bg-green-50 border-green-200',
  },
};

/**
 * Displays the overall system state with color-coded status.
 *
 * The system state summary provides a quick overview of the
 * Dual-Invariant system's health, combining information from
 * both the cognitive and emotional subsystems.
 *
 * @param props - Component props
 * @returns The rendered system state summary
 *
 * @example
 * ```tsx
 * <SystemStateSummary state="stable" />
 * <SystemStateSummary state="critical" />
 * ```
 */
export function SystemStateSummary({
  state,
}: SystemStateSummaryProps): React.ReactElement {
  const config = stateConfigs[state];

  return (
    <div
      className={`system-state-summary p-4 border rounded-lg ${config.bgClass}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-600">System State:</span>
        <span className={`text-lg font-bold ${config.colorClass}`}>
          {config.label}
        </span>
      </div>
      <p className={`text-sm ${config.colorClass}`}>{config.description}</p>
    </div>
  );
}
