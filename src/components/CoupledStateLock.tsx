/**
 * CoupledStateLock Component
 *
 * Visual indicator showing whether the cognitive and emotional
 * subsystems are operating in a coupled (synchronized) state.
 * Coupling is essential for coherent processing in the
 * Dual-Invariant architecture.
 *
 * @module CoupledStateLock
 */

import React from 'react';
import type { CoupledStateLockProps } from '../types';

/**
 * Displays the coupled/uncoupled state of the cognitive-emotional system.
 *
 * When coupled, the cognitive and emotional subsystems are synchronized
 * and working together. When uncoupled, there may be misalignment
 * between cognitive processing and emotional response, which can lead
 * to inconsistent behavior or distress.
 *
 * @param props - Component props
 * @returns The rendered coupled state indicator
 *
 * @example
 * ```tsx
 * <CoupledStateLock isCoupled={true} />
 * <CoupledStateLock isCoupled={false} />
 * ```
 */
export function CoupledStateLock({
  isCoupled,
}: CoupledStateLockProps): React.ReactElement {
  return (
    <div
      className="coupled-state-lock p-3 border rounded-lg flex items-center gap-3"
      role="status"
      aria-live="polite"
    >
      <span
        className={`inline-block w-3 h-3 rounded-full ${
          isCoupled ? 'bg-green-500' : 'bg-red-500'
        }`}
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-gray-700">
        {isCoupled ? (
          <span className="text-green-700">
            Coupled — Cognitive-Emotional Synchronization Active
          </span>
        ) : (
          <span className="text-red-700">
            Uncoupled — Cognitive-Emotional Desynchronization
          </span>
        )}
      </span>
    </div>
  );
}
