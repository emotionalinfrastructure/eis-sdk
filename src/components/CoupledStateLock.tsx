/**
 * @fileoverview CoupledStateLock component for indicating system coupling status.
 * 
 * This component displays whether the cognitive (CoC) and emotional (ERG)
 * subsystems are coupled or uncoupled in the dual-invariant architecture.
 * Coupling occurs when both subsystems maintain integrity above a threshold.
 */

import React from 'react';

/**
 * Props for the CoupledStateLock component.
 */
export interface CoupledStateLockProps {
  /**
   * Whether the subsystems are currently coupled.
   * True indicates synchronized operation between CoC and ERG.
   */
  isCoupled: boolean;
}

/**
 * Displays the coupling status between cognitive and emotional subsystems.
 * 
 * The coupling indicator shows whether the Chain of Custody (CoC) and
 * Emotional Regulation Graph (ERG) are operating in synchronized mode.
 * When both subsystems maintain integrity above the coupling threshold,
 * they are considered coupled, allowing for coordinated processing.
 * 
 * Visual representation:
 * - Coupled: Green dot with "Coupled" text
 * - Uncoupled: Red dot with "Uncoupled" text
 * 
 * @param props - Component props
 * @returns The rendered CoupledStateLock component
 * 
 * @example
 * <CoupledStateLock isCoupled={true} />
 */
export function CoupledStateLock({
  isCoupled,
}: CoupledStateLockProps): React.ReactElement {
  const dotColorClass = isCoupled ? 'bg-green-500' : 'bg-red-500';
  const textColorClass = isCoupled ? 'text-green-700' : 'text-red-700';
  const statusText = isCoupled ? 'Coupled' : 'Uncoupled';

  return (
    <div
      className="coupled-state-lock flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
      role="status"
      aria-live="polite"
      aria-label={`System coupling status: ${statusText}`}
    >
      <span
        className={`inline-block w-3 h-3 rounded-full ${dotColorClass}`}
        aria-hidden="true"
      />
      <span className={`text-sm font-medium ${textColorClass}`}>
        {statusText}
      </span>
      <span className="text-xs text-gray-500 ml-1">
        (CoC ↔ ERG)
      </span>
    </div>
  );
}

export default CoupledStateLock;
