/**
 * EmotionPanel Component (EmotionalRuntimeGovernance)
 *
 * Displays the Emotional Runtime Governance (ERG) integrity level
 * in the Dual-Invariant cognitive architecture. ERG represents
 * the stability and regulation of emotional processing.
 *
 * @module EmotionPanel
 */

import React from 'react';
import type { EmotionPanelProps } from '../types';

/**
 * Maps system state to human-readable emotional labels.
 */
const stateLabels: Record<string, string> = {
  fractured: 'Emotional Dysregulation',
  critical: 'Emotional Overwhelm',
  narrowed: 'Constricted Emotional Range',
  stable: 'Full Emotional Regulation',
};

/**
 * Displays the Emotional Runtime Governance integrity and state.
 *
 * The ERG invariant ensures that emotional responses remain
 * regulated and appropriate. When integrity is high, emotions
 * are well-modulated; when low, the system may experience
 * dysregulation or flooding.
 *
 * @param props - Component props
 * @returns The rendered emotion panel
 *
 * @example
 * ```tsx
 * <EmotionPanel
 *   integrity={{ min: 60, max: 100 }}
 *   state="narrowed"
 * />
 * ```
 */
export function EmotionPanel({
  integrity,
  state,
}: EmotionPanelProps): React.ReactElement {
  const label = stateLabels[state] || 'Unknown State';

  return (
    <div className="emotion-panel p-4 border rounded-lg bg-purple-50">
      <h3 className="text-lg font-semibold text-purple-800 mb-2">
        Emotional Runtime Governance (ERG)
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Integrity Range:</span>
          <span
            className="font-mono text-purple-700"
            aria-label={`Integrity range from ${integrity.min} to ${integrity.max}`}
          >
            {integrity.min}–{integrity.max}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current State:</span>
          <span
            className="font-medium text-purple-700"
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
          aria-label="Emotional integrity level"
        >
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${integrity.min}%` }}
          />
        </div>
      </div>
    </div>
  );
}
