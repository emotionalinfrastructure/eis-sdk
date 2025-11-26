/**
 * @fileoverview SystemStateSummary component for displaying overall system state.
 * 
 * This component displays the overall system state derived from integrity
 * calculations in the dual-invariant cognitive/emotional architecture.
 * The state reflects the minimum of CoC and ERG integrity levels.
 */

import React from 'react';
import type { SystemState } from '../types';

/**
 * Props for the SystemStateSummary component.
 */
export interface SystemStateSummaryProps {
  /**
   * Current overall system state.
   */
  state: SystemState;
}

/**
 * Configuration for each system state's display properties.
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
const STATE_CONFIGS: Record<SystemState, StateConfig> = {
  fractured: {
    label: 'Fractured',
    description: 'Critical failure state. Immediate intervention required.',
    colorClass: 'text-red-700',
    bgClass: 'bg-red-100 border-red-300',
  },
  critical: {
    label: 'Critical',
    description: 'Severe degradation detected. System stability compromised.',
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-100 border-orange-300',
  },
  narrowed: {
    label: 'Narrowed',
    description: 'Reduced capacity. Operating within acceptable tolerances.',
    colorClass: 'text-yellow-700',
    bgClass: 'bg-yellow-100 border-yellow-300',
  },
  stable: {
    label: 'Stable',
    description: 'Optimal functioning. All subsystems synchronized.',
    colorClass: 'text-green-700',
    bgClass: 'bg-green-100 border-green-300',
  },
};

/**
 * Displays the overall system state with label and description.
 * 
 * The system state is derived from the minimum of CoC and ERG integrity:
 * - Fractured: minIntegrity < 20 (critical failure)
 * - Critical: minIntegrity >= 20 && < 40 (severe degradation)
 * - Narrowed: minIntegrity >= 40 && < 80 (reduced capacity)
 * - Stable: minIntegrity >= 80 (optimal functioning)
 * 
 * Each state is displayed with appropriate color coding and a
 * descriptive message about the system's condition.
 * 
 * @param props - Component props
 * @returns The rendered SystemStateSummary component
 * 
 * @example
 * <SystemStateSummary state="stable" />
 */
export function SystemStateSummary({
  state,
}: SystemStateSummaryProps): React.ReactElement {
  const config = STATE_CONFIGS[state];

  return (
    <div
      className={`system-state-summary p-4 rounded-lg border ${config.bgClass}`}
      role="region"
      aria-label="System State Summary"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-gray-600">
          System State:
        </span>
        <span
          className={`text-lg font-bold ${config.colorClass}`}
          aria-live="polite"
        >
          {config.label}
        </span>
      </div>
      <p className={`text-sm ${config.colorClass}`}>
        {config.description}
      </p>
    </div>
  );
}

export default SystemStateSummary;
