/**
 * @fileoverview SaturationInputPanel component for adjusting saturation levels.
 * 
 * This component provides an accessible interface for controlling the saturation
 * level in the Cognitive Stability System. It includes a slider and increment/decrement
 * buttons with full keyboard and screen reader support.
 */

import React from 'react';
import type { SaturationInputPanelProps } from '../types';
import { clamp } from '../lib/stability';

/**
 * SaturationInputPanel provides an accessible control for adjusting saturation.
 * 
 * Features:
 * - Range slider (0-100) with keyboard navigation
 * - Increment/decrement buttons (±5)
 * - ARIA labels and live region for screen reader announcements
 * - Focus-visible styles for keyboard users
 * 
 * @param props - Component props
 * @param props.saturation - Current saturation value (0-100)
 * @param props.onSaturationChange - Callback when saturation changes
 * 
 * @example
 * ```tsx
 * <SaturationInputPanel
 *   saturation={50}
 *   onSaturationChange={(value) => setSaturation(value)}
 * />
 * ```
 */
export function SaturationInputPanel({
  saturation,
  onSaturationChange,
}: SaturationInputPanelProps): React.ReactElement {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value, 10);
    onSaturationChange(value);
  };

  const handleIncrement = (): void => {
    onSaturationChange(clamp(saturation + 5, 0, 100));
  };

  const handleDecrement = (): void => {
    onSaturationChange(clamp(saturation - 5, 0, 100));
  };

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg bg-white"
      role="group"
      aria-labelledby="saturation-label"
    >
      <label
        id="saturation-label"
        htmlFor="saturation-slider"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Emotional Saturation Level
      </label>
      
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={saturation <= 0}
          aria-label="Decrease saturation by 5"
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          −5
        </button>
        
        <input
          id="saturation-slider"
          type="range"
          min={0}
          max={100}
          step={1}
          value={saturation}
          onChange={handleSliderChange}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={saturation}
          aria-valuetext={`${saturation} percent saturation`}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="button"
          onClick={handleIncrement}
          disabled={saturation >= 100}
          aria-label="Increase saturation by 5"
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          +5
        </button>
      </div>
      
      <output
        htmlFor="saturation-slider"
        aria-live="polite"
        className="block mt-2 text-center text-lg font-semibold text-gray-900"
      >
        {saturation}%
      </output>
    </div>
  );
}

export default SaturationInputPanel;
