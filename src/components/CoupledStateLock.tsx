/**
 * @fileoverview CoupledStateLock component for displaying coupling status.
 * 
 * This component displays whether the cognitive-emotional system is in a
 * coupled (coherent) or uncoupled (fragmented) state. A visual indicator
 * and textual label provide accessible feedback.
 */

import React from 'react';
import type { CoupledStateLockProps } from '../types';

/**
 * CoupledStateLock displays the coupling state between cognitive and emotional systems.
 * 
 * When coupled:
 * - The Cognitive Operations Center (CoC) and Emotional Regulatory Gland (ERG)
 *   are operating in sync
 * - Processing is coherent and integrated
 * - The system can handle complex tasks effectively
 * 
 * When uncoupled:
 * - Cognitive and emotional processing are fragmented
 * - The system may experience processing conflicts
 * - Reduced capacity for integrated decision-making
 * 
 * The component uses both color (green/red dot) and text ("Coupled"/"Uncoupled")
 * for colorblind accessibility.
 * 
 * @param props - Component props
 * @param props.isCoupled - Whether the system is in a coupled state
 * 
 * @example
 * ```tsx
 * <CoupledStateLock isCoupled={true} />  // Green dot, "Coupled" text
 * <CoupledStateLock isCoupled={false} /> // Red dot, "Uncoupled" text
 * ```
 */
export function CoupledStateLock({
  isCoupled,
}: CoupledStateLockProps): React.ReactElement {
  const dotColorClass = isCoupled ? 'bg-green-500' : 'bg-red-500';
  const textColorClass = isCoupled ? 'text-green-600' : 'text-red-600';
  const statusText = isCoupled ? 'Coupled' : 'Uncoupled';
  const description = isCoupled
    ? 'Cognitive and emotional systems are operating in sync'
    : 'Cognitive and emotional systems are fragmented';

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg bg-white"
      role="status"
      aria-label={`Coupling status: ${statusText}`}
    >
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        System Coupling
      </h3>
      
      <div className="flex items-center gap-3">
        <span
          className={`w-4 h-4 rounded-full ${dotColorClass}`}
          aria-hidden="true"
        />
        <span className={`text-lg font-semibold ${textColorClass}`}>
          {statusText}
        </span>
      </div>
      
      <p
        className="mt-2 text-sm text-gray-600"
        aria-live="polite"
      >
        {description}
      </p>
    </div>
  );
}

export default CoupledStateLock;
