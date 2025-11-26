/**
 * @fileoverview SaturationInputPanel component for controlling emotional saturation.
 * 
 * This component provides accessible controls for adjusting the saturation level
 * in the dual-invariant cognitive/emotional architecture. It includes a slider
 * for fine-grained control and +/- buttons for discrete adjustments.
 */

import React from 'react';

/**
 * Props for the SaturationInputPanel component.
 */
export interface SaturationInputPanelProps {
  /**
   * Current saturation value (0-100).
   */
  value: number;

  /**
   * Callback invoked when the saturation value changes.
   * @param value - The new saturation value
   */
  onChange: (value: number) => void;
}

/**
 * A controlled input panel for adjusting emotional saturation levels.
 * 
 * Provides a slider (range input) with accessible labels and ARIA attributes,
 * plus increment/decrement buttons for discrete 5-unit adjustments.
 * 
 * The saturation level represents the degree of emotional activation in
 * the system, which inversely affects Chain of Custody (CoC) integrity
 * while directly affecting Emotional Regulation Graph (ERG) integrity.
 * 
 * @param props - Component props
 * @returns The rendered SaturationInputPanel component
 * 
 * @example
 * <SaturationInputPanel
 *   value={saturation}
 *   onChange={setSaturation}
 * />
 */
export function SaturationInputPanel({
  value,
  onChange,
}: SaturationInputPanelProps): React.ReactElement {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  const handleDecrement = () => {
    onChange(Math.max(0, value - 5));
  };

  const handleIncrement = () => {
    onChange(Math.min(100, value + 5));
  };

  return (
    <div className="saturation-input-panel p-4 bg-gray-50 rounded-lg">
      <label
        htmlFor="saturation-slider"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Emotional Saturation Level
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= 0}
          aria-label="Decrease saturation by 5"
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          −5
        </button>

        <input
          id="saturation-slider"
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={handleSliderChange}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${value} percent saturation`}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= 100}
          aria-label="Increase saturation by 5"
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          +5
        </button>
      </div>

      <output
        htmlFor="saturation-slider"
        aria-live="polite"
        className="block mt-2 text-center text-lg font-semibold text-gray-800"
      >
        {value}%
      </output>
    </div>
  );
}

export default SaturationInputPanel;
