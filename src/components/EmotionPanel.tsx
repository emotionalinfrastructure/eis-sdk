/**
 * @fileoverview EmotionPanel component for displaying ERG integrity.
 * 
 * This component displays the ERG (Emotional Regulation Graph) integrity level
 * within the dual-invariant cognitive/emotional architecture. ERG represents
 * the emotional subsystem's structural integrity.
 */

import React from 'react';

/**
 * Props for the EmotionPanel component.
 */
export interface EmotionPanelProps {
  /**
   * Current ERG (Emotional Regulation Graph) integrity value (0-100).
   */
  integrity: number;
}

/**
 * Returns a textual label describing the integrity level.
 * 
 * @param integrity - The integrity value (0-100)
 * @returns A descriptive label for the integrity level
 */
function getIntegrityLabel(integrity: number): string {
  if (integrity < 20) return 'Critical';
  if (integrity < 40) return 'Degraded';
  if (integrity < 80) return 'Moderate';
  return 'Optimal';
}

/**
 * Returns a CSS class for styling based on integrity level.
 * 
 * @param integrity - The integrity value (0-100)
 * @returns A Tailwind CSS class for the integrity level color
 */
function getIntegrityColorClass(integrity: number): string {
  if (integrity < 20) return 'text-red-600';
  if (integrity < 40) return 'text-orange-500';
  if (integrity < 80) return 'text-yellow-600';
  return 'text-green-600';
}

/**
 * Displays the Emotional Regulation Graph (ERG) integrity level.
 * 
 * The ERG represents the emotional subsystem's structural integrity,
 * which increases as emotional saturation increases. This direct
 * relationship models how emotional activation strengthens the
 * emotional processing pathways.
 * 
 * @param props - Component props
 * @returns The rendered EmotionPanel component
 * 
 * @example
 * <EmotionPanel integrity={60} />
 */
export function EmotionPanel({
  integrity,
}: EmotionPanelProps): React.ReactElement {
  const label = getIntegrityLabel(integrity);
  const colorClass = getIntegrityColorClass(integrity);

  return (
    <div
      className="emotion-panel p-4 bg-purple-50 rounded-lg"
      role="region"
      aria-label="Emotional Regulation Graph Integrity"
    >
      <h3 className="text-sm font-medium text-gray-700 mb-1">
        ERG Integrity (Emotional)
      </h3>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-2xl font-bold ${colorClass}`}
          aria-live="polite"
        >
          {integrity.toFixed(0)}%
        </span>
        <span className={`text-sm ${colorClass}`}>
          {label}
        </span>
      </div>
      <div
        className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={integrity}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`ERG integrity at ${integrity} percent`}
      >
        <div
          className="h-full bg-purple-500 transition-all duration-200"
          style={{ width: `${integrity}%` }}
        />
      </div>
    </div>
  );
}

export default EmotionPanel;
