/**
 * @fileoverview FrameworkNotes component for displaying explanatory information.
 * 
 * This component provides read-only explanatory notes about the dual-invariant
 * cognitive/emotional architecture and its protected invariants.
 */

import React from 'react';

/**
 * Displays read-only explanatory notes about the framework.
 * 
 * This component explains the key concepts of the Cognitive Stability System,
 * including the dual-invariant architecture, protected invariants, and the
 * relationship between cognitive and emotional subsystems.
 * 
 * Note: This component references protected governance files (consent/audit)
 * which must not be modified to maintain system integrity.
 * 
 * @returns The rendered FrameworkNotes component
 * 
 * @example
 * <FrameworkNotes />
 */
export function FrameworkNotes(): React.ReactElement {
  return (
    <aside
      className="framework-notes p-4 bg-slate-50 rounded-lg border border-slate-200"
      role="complementary"
      aria-label="Framework Notes"
    >
      <h3 className="text-sm font-semibold text-slate-700 mb-2">
        Dual-Invariant Architecture Notes
      </h3>
      <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
        <li>
          <strong>CoC (Chain of Custody):</strong> Represents cognitive integrity.
          Decreases with increased emotional saturation.
        </li>
        <li>
          <strong>ERG (Emotional Regulation Graph):</strong> Represents emotional
          integrity. Increases with emotional saturation.
        </li>
        <li>
          <strong>Coupling:</strong> Both subsystems are coupled when integrity
          values exceed the minimum threshold (20).
        </li>
        <li>
          <strong>Protected Invariants:</strong> Governance files in{' '}
          <code className="px-1 py-0.5 bg-slate-200 rounded text-slate-700">
            src/consent/*
          </code>{' '}
          and{' '}
          <code className="px-1 py-0.5 bg-slate-200 rounded text-slate-700">
            src/audit/*
          </code>{' '}
          are protected and must not be modified.
        </li>
        <li>
          <strong>State Thresholds:</strong> Fractured (&lt;20), Critical (20-39),
          Narrowed (40-79), Stable (≥80).
        </li>
      </ul>
    </aside>
  );
}

export default FrameworkNotes;
