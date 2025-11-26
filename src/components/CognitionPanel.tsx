/**
 * CognitionPanel Component (ContinuityOfCognition)
 *
 * Displays the Continuity of Cognition (CoC) integrity level
 * in the Dual-Invariant cognitive architecture. CoC represents
 * the stability and coherence of cognitive processing.
 *
 * @module CognitionPanel
 */

import React from 'react';
import type { CognitionPanelProps } from '../types';

/**
 * Maps system state to human-readable cognitive labels.
 */
const stateLabels: Record<string, string> = {
  fractured: 'Cognitive Fragmentation',
  critical: 'Cognitive Strain',
  narrowed: 'Reduced Cognitive Bandwidth',
  stable: 'Full Cognitive Integration',
};

/**
 * Displays the Continuity of Cognition integrity and state.
 *
 * The CoC invariant ensures that cognitive processing remains
 * coherent across state transitions. When integrity is high,
 * the cognitive system can handle complexity; when low, it
 * struggles with even simple tasks.
 *
 * @param props - Component props
 * @returns The rendered cognition panel
 *
 * @example
 * ```tsx
 * <CognitionPanel
 *   integrity={{ min: 60, max: 100 }}
 *   state="narrowed"
 * />
 * ```
 */
export function CognitionPanel({
  integrity,
  state,
}: CognitionPanelProps): React.ReactElement {
  const label = stateLabels[state] || 'Unknown State';

  return (
    <div className="cognition-panel p-4 border rounded-lg bg-blue-50">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        Continuity of Cognition (CoC)
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Integrity Range:</span>
          <span
            className="font-mono text-blue-700"
            aria-label={`Integrity range from ${integrity.min} to ${integrity.max}`}
          >
            {integrity.min}–{integrity.max}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current State:</span>
          <span
            className="font-medium text-blue-700"
            aria-live="polite"
          >
            {label}
          </span>
        </div>

        <div
          className="w-full bg-gray-200 rounded-full h-2 mt-2"
          role="progressbar"
          aria-valuenow={integrity.min}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Cognitive integrity level"
        >
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${integrity.min}%` }}
          />
        </div>
      </div>
    </div>
  );
}
