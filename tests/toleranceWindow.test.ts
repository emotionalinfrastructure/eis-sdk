/**
 * Tests for tolerance window
 */

import { createToleranceWindow, isWithinTolerance } from '../src/consent/toleranceWindow';

describe('ToleranceWindow', () => {
  describe('createToleranceWindow', () => {
    it('should create a tolerance window with baseline and variance', () => {
      const window = createToleranceWindow(10, 2);
      expect(window.baseline).toBe(10);
      expect(window.variance).toBe(2);
      expect(window.timestamp).toBeDefined();
    });
  });
  
  describe('isWithinTolerance', () => {
    it('should return true for values within tolerance', () => {
      const window = createToleranceWindow(10, 2);
      expect(isWithinTolerance(10, window)).toBe(true);
      expect(isWithinTolerance(11, window)).toBe(true);
      expect(isWithinTolerance(9, window)).toBe(true);
    });
    
    it('should return false for values outside tolerance', () => {
      const window = createToleranceWindow(10, 2);
      expect(isWithinTolerance(13, window)).toBe(false);
      expect(isWithinTolerance(7, window)).toBe(false);
    });
    
    it('should handle boundary values correctly', () => {
      const window = createToleranceWindow(10, 2);
      expect(isWithinTolerance(12, window)).toBe(true);
      expect(isWithinTolerance(8, window)).toBe(true);
    });
  });
});
