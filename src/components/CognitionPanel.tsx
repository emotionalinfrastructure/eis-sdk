/**
 * @fileoverview CognitionPanel component for displaying CoC integrity.
 * 
 * This component displays the Cognitive Operations Center (CoC) integrity value
 * with an accessible textual label. The CoC represents the cognitive processing
 * capacity in the Emotional Infrastructure architecture.
 */

import React from 'react';
import type { CognitionPanelProps } from '../types';
import { getIntegrityLabel, getIntegrityColorClass } from '../lib/stability';

/**
 * CognitionPanel displays the Cognitive Operations Center (CoC) integrity.
 * 
 * The CoC represents the cognitive processing capacity, including:
 * - Working memory capacity
 * - Decision-making ability
 * - Logical reasoning function
 * 
 * The component provides both numeric and textual representations
 * for accessibility (colorblind-friendly).
 * 
 * @param props - Component props
 * @param props.integrity - Current integrity values
 * 
 * @example
 * ```tsx
 * <CognitionPanel integrity={{ erg: 75, coc: 75 }} />
 * ```
 */
export function CognitionPanel({
  integrity,
}: CognitionPanelProps): React.ReactElement {
  const { coc } = integrity;
  const label = getIntegrityLabel(coc);
  const colorClass = getIntegrityColorClass(coc);

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg bg-white"
      role="region"
      aria-label="Cognitive Operations Center status"
    >
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Cognitive Operations Center (CoC)
      </h3>
      
      <div className="flex items-baseline gap-2">
        <span
          className={`text-3xl font-bold ${colorClass}`}
          aria-hidden="true"
        >
          {coc}%
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

export default CognitionPanel;
