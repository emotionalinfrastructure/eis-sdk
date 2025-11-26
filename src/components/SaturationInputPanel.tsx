/**
 * SaturationInputPanel Component
 *
 * Provides a controlled slider interface for adjusting the saturation
 * level in the Dual-Invariant cognitive architecture. Saturation
 * represents the load/stress on the cognitive-emotional system.
 *
 * @module SaturationInputPanel
 */

import React from 'react';
import type { SaturationInputPanelProps } from '../types';
import { clamp } from '../lib/stability';

/**
 * Accessible slider panel for adjusting cognitive saturation levels.
 *
 * Features:
 * - Range slider from 0-100
 * - +/- 5 adjustment buttons for fine control
 * - Full keyboard accessibility
 * - ARIA attributes for screen readers
 *
 * In the Dual-Invariant framework, higher saturation corresponds to
 * lower integrity, simulating increased cognitive/emotional load.
 *
 * @param props - Component props
 * @returns The rendered saturation input panel
 *
 * @example
 * ```tsx
 * <SaturationInputPanel
 *   saturation={50}
 *   onSaturationChange={(val) => setSaturation(val)}
 * />
 * ```
 */
export function SaturationInputPanel({
  saturation,
  onSaturationChange,
}: SaturationInputPanelProps): React.ReactElement {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    onSaturationChange(clamp(value));
  };

  const handleIncrement = () => {
    onSaturationChange(clamp(saturation + 5));
  };

  const handleDecrement = () => {
    onSaturationChange(clamp(saturation - 5));
  };

  return (
    <div className="saturation-input-panel p-4 border rounded-lg bg-gray-50">
      <label
        htmlFor="saturation-slider"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Cognitive Saturation Level
      </label>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={saturation <= 0}
          aria-label="Decrease saturation by 5"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -5
        </button>

        <input
          type="range"
          id="saturation-slider"
          min={0}
          max={100}
          value={saturation}
          onChange={handleSliderChange}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={saturation}
          aria-valuetext={`${saturation} percent saturation`}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={saturation >= 100}
          aria-label="Increase saturation by 5"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +5
        </button>
      </div>

      <output
        htmlFor="saturation-slider"
        aria-live="polite"
        className="block mt-2 text-center text-lg font-semibold text-gray-800"
      >
        {saturation}%
      </output>
    </div>
  );
}
