/**
 * Tests for stability module pure functions
 * 
 * Tests the Dual-Invariant cognitive architecture helper functions
 * for integrity calculation and system state determination.
 */

import {
  clamp,
  calculateIntegrity,
  getSystemState,
  isCoupled,
  type Integrity,
} from '../src/lib/stability';

describe('Stability Module', () => {
  describe('clamp', () => {
    it('should return 0 for negative values', () => {
      expect(clamp(-5)).toBe(0);
      expect(clamp(-100)).toBe(0);
    });

    it('should return 100 for values over 100', () => {
      expect(clamp(150)).toBe(100);
      expect(clamp(1000)).toBe(100);
    });

    it('should return the same value for values in range', () => {
      expect(clamp(0)).toBe(0);
      expect(clamp(50)).toBe(50);
      expect(clamp(100)).toBe(100);
    });

    it('should handle edge cases', () => {
      expect(clamp(0.5)).toBe(0.5);
      expect(clamp(99.9)).toBe(99.9);
    });
  });

  describe('calculateIntegrity', () => {
    it('should calculate integrity with saturation 0', () => {
      const integrity = calculateIntegrity(0);
      expect(integrity.min).toBe(100);
      expect(integrity.max).toBe(100);
    });

    it('should calculate integrity with saturation 100', () => {
      const integrity = calculateIntegrity(100);
      expect(integrity.min).toBe(0);
      expect(integrity.max).toBe(100);
    });

    it('should calculate integrity with saturation 50', () => {
      const integrity = calculateIntegrity(50);
      expect(integrity.min).toBe(50);
      expect(integrity.max).toBe(100);
    });

    it('should calculate integrity with saturation 20', () => {
      const integrity = calculateIntegrity(20);
      expect(integrity.min).toBe(80);
      expect(integrity.max).toBe(100);
    });

    it('should clamp saturation values below 0', () => {
      const integrity = calculateIntegrity(-10);
      expect(integrity.min).toBe(100);
      expect(integrity.max).toBe(100);
    });

    it('should clamp saturation values above 100', () => {
      const integrity = calculateIntegrity(150);
      expect(integrity.min).toBe(0);
      expect(integrity.max).toBe(100);
    });
  });

  describe('getSystemState', () => {
    it('should return fractured for minIntegrity < 20', () => {
      expect(getSystemState({ min: 0, max: 100 })).toBe('fractured');
      expect(getSystemState({ min: 10, max: 100 })).toBe('fractured');
      expect(getSystemState({ min: 19, max: 100 })).toBe('fractured');
      expect(getSystemState({ min: 19.9, max: 100 })).toBe('fractured');
    });

    it('should return critical for minIntegrity >= 20 && < 40', () => {
      expect(getSystemState({ min: 20, max: 100 })).toBe('critical');
      expect(getSystemState({ min: 30, max: 100 })).toBe('critical');
      expect(getSystemState({ min: 39, max: 100 })).toBe('critical');
      expect(getSystemState({ min: 39.9, max: 100 })).toBe('critical');
    });

    it('should return narrowed for minIntegrity >= 40 && < 80', () => {
      expect(getSystemState({ min: 40, max: 100 })).toBe('narrowed');
      expect(getSystemState({ min: 60, max: 100 })).toBe('narrowed');
      expect(getSystemState({ min: 79, max: 100 })).toBe('narrowed');
      expect(getSystemState({ min: 79.9, max: 100 })).toBe('narrowed');
    });

    it('should return stable for minIntegrity >= 80', () => {
      expect(getSystemState({ min: 80, max: 100 })).toBe('stable');
      expect(getSystemState({ min: 90, max: 100 })).toBe('stable');
      expect(getSystemState({ min: 100, max: 100 })).toBe('stable');
    });
  });

  describe('isCoupled', () => {
    it('should return true when integrity is above default threshold', () => {
      expect(isCoupled({ min: 20, max: 100 })).toBe(true);
      expect(isCoupled({ min: 50, max: 100 })).toBe(true);
      expect(isCoupled({ min: 100, max: 100 })).toBe(true);
    });

    it('should return false when integrity is below default threshold', () => {
      expect(isCoupled({ min: 0, max: 100 })).toBe(false);
      expect(isCoupled({ min: 10, max: 100 })).toBe(false);
      expect(isCoupled({ min: 19, max: 100 })).toBe(false);
    });

    it('should respect custom threshold parameter', () => {
      const integrity: Integrity = { min: 25, max: 100 };
      expect(isCoupled(integrity, 30)).toBe(false);
      expect(isCoupled(integrity, 25)).toBe(true);
      expect(isCoupled(integrity, 20)).toBe(true);
    });

    it('should handle edge case at exactly threshold', () => {
      expect(isCoupled({ min: 20, max: 100 }, 20)).toBe(true);
      expect(isCoupled({ min: 19.9, max: 100 }, 20)).toBe(false);
    });
  });

  describe('integration: saturation to state mapping', () => {
    it('should map saturation 20 to stable state', () => {
      const integrity = calculateIntegrity(20);
      expect(getSystemState(integrity)).toBe('stable');
    });

    it('should map saturation 60 to narrowed state', () => {
      const integrity = calculateIntegrity(60);
      expect(getSystemState(integrity)).toBe('narrowed');
    });

    it('should map saturation 80 to critical state', () => {
      const integrity = calculateIntegrity(80);
      expect(getSystemState(integrity)).toBe('critical');
    });

    it('should map saturation 90 to fractured state', () => {
      const integrity = calculateIntegrity(90);
      expect(getSystemState(integrity)).toBe('fractured');
    });
  });
});
