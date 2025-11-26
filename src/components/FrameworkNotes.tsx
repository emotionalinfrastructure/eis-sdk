/**
 * @fileoverview FrameworkNotes component for displaying explanatory notes.
 * 
 * This component provides read-only explanatory notes about the Cognitive
 * Stability System, including information about protected invariants and
 * the theoretical framework.
 */

import React from 'react';

/**
 * FrameworkNotes displays read-only explanatory notes about the system.
 * 
 * This component provides context about:
 * - The Emotional Infrastructure™ framework
 * - Protected invariants and governance
 * - How saturation affects cognitive and emotional integrity
 * - Threshold meanings and implications
 * 
 * Note: This component references protected invariants that are defined
 * in the repository's governance files (src/consent/*, src/audit/*).
 * These files should not be modified as they contain immutable audit
 * and consent logic.
 * 
 * @example
 * ```tsx
 * <FrameworkNotes />
 * ```
 */
export function FrameworkNotes(): React.ReactElement {
  return (
    <aside
      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
      role="note"
      aria-label="Framework notes"
    >
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Framework Notes
      </h3>
      
      <div className="space-y-3 text-sm text-gray-700">
        <p>
          <strong>Emotional Infrastructure™</strong> models the relationship
          between emotional saturation and cognitive-emotional integrity.
        </p>
        
        <p>
          <strong>Saturation</strong> represents the level of emotional load.
          Higher saturation reduces integrity, impairing cognitive and emotional
          processing capacity.
        </p>
        
        <section>
          <h4 className="font-medium text-gray-800 mb-1">Thresholds:</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Stable</strong> (≥80%): Full cognitive/emotional capacity</li>
            <li><strong>Narrowed</strong> (40-79%): Reduced capacity, functioning with limitations</li>
            <li><strong>Critical</strong> (20-39%): Significant impairment</li>
            <li><strong>Fractured</strong> (&lt;20%): Severe impairment, fragmented processing</li>
          </ul>
        </section>
        
        <section>
          <h4 className="font-medium text-gray-800 mb-1">Coupling:</h4>
          <p>
            When integrity falls below 20%, the Cognitive Operations Center (CoC)
            and Emotional Regulatory Gland (ERG) become uncoupled, leading to
            fragmented processing.
          </p>
        </section>
        
        <section className="pt-2 border-t border-gray-200">
          <h4 className="font-medium text-gray-800 mb-1">Protected Invariants:</h4>
          <p className="text-gray-600">
            The consent lifecycle and audit logging systems are protected by
            governance rules. Files in <code className="bg-gray-200 px-1 rounded">src/consent/*</code> and{' '}
            <code className="bg-gray-200 px-1 rounded">src/audit/*</code> contain
            immutable logic and should not be modified.
          </p>
        </section>
      </div>
    </aside>
  );
}

export default FrameworkNotes;
