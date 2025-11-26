/**
 * FrameworkNotes Component
 *
 * Read-only explanatory panel describing the Dual-Invariant
 * cognitive architecture and its protected invariants.
 *
 * @module FrameworkNotes
 */

import React from 'react';

/**
 * Displays read-only explanatory notes about the framework.
 *
 * This component provides context about the Dual-Invariant
 * cognitive-emotional architecture, including information about
 * the protected governance files and system invariants.
 *
 * @returns The rendered framework notes panel
 *
 * @example
 * ```tsx
 * <FrameworkNotes />
 * ```
 */
export function FrameworkNotes(): React.ReactElement {
  return (
    <div className="framework-notes p-4 border rounded-lg bg-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Dual-Invariant Framework Notes
      </h3>

      <div className="space-y-3 text-sm text-gray-600">
        <p>
          This visualization demonstrates the Dual-Invariant cognitive-emotional
          architecture. The system maintains two core invariants:
        </p>

        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <strong>Continuity of Cognition (CoC)</strong> — ensures coherent
            cognitive processing across state transitions
          </li>
          <li>
            <strong>Emotional Runtime Governance (ERG)</strong> — maintains
            regulated emotional responses and appropriate modulation
          </li>
        </ul>

        <p>
          Saturation represents the current load on the system. As saturation
          increases, integrity decreases, and the system transitions through
          states: <em>stable → narrowed → critical → fractured</em>.
        </p>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
          <p className="text-amber-800">
            <strong>Protected Invariants:</strong> The consent lifecycle
            (<code>src/consent/*</code>) and audit logging
            (<code>src/audit/*</code>) modules are protected governance files
            that should not be modified. They ensure behavioral accountability
            and trust repair capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
