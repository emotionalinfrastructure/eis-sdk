/**
 * @fileoverview EmotionPanel component for displaying ERG integrity.
 * 
 * This component displays the Emotional Regulatory Gland (ERG) integrity value
 * with an accessible textual label. The ERG represents the emotional processing
 * and regulation capacity in the Emotional Infrastructure architecture.
 */

import React from 'react';
import type { EmotionPanelProps } from '../types';
import { getIntegrityLabel, getIntegrityColorClass } from '../lib/stability';

/**
 * EmotionPanel displays the Emotional Regulatory Gland (ERG) integrity.
 * 
 * The ERG represents the emotional processing capacity, including:
 * - Emotional regulation ability
 * - Affect processing function
 * - Emotional resilience level
 * 
 * The component provides both numeric and textual representations
 * for accessibility (colorblind-friendly).
 * 
 * @param props - Component props
 * @param props.integrity - Current integrity values
 * 
 * @example
 * ```tsx
 * <EmotionPanel integrity={{ erg: 75, coc: 75 }} />
 * ```
 */
export function EmotionPanel({
  integrity,
}: EmotionPanelProps): React.ReactElement {
  const { erg } = integrity;
  const label = getIntegrityLabel(erg);
  const colorClass = getIntegrityColorClass(erg);

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg bg-white"
      role="region"
      aria-label="Emotional Regulatory Gland status"
    >
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Emotional Regulatory Gland (ERG)
      </h3>
      
      <div className="flex items-baseline gap-2">
        <span
          className={`text-3xl font-bold ${colorClass}`}
          aria-hidden="true"
        >
          {erg}%
        </span>
        <span className="text-sm text-gray-600">
          integrity
        </span>
      </div>
      
      <p
        className={`mt-1 text-sm font-medium ${colorClass}`}
        aria-live="polite"
      >
        Status: {label}
      </p>
    </div>
  );
}

export default EmotionPanel;
