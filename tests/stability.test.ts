/**
 * Tests for stability calculation utilities
 */

import {
  clamp,
  calculateIntegrity,
  getSystemState,
  isCoupled,
} from '../src/lib/stability';

describe('Stability Utilities', () => {
  describe('clamp', () => {
    it('should return value within range unchanged', () => {
      expect(clamp(50, 0, 100)).toBe(50);
    });

    it('should clamp value above max to max', () => {
      expect(clamp(150, 0, 100)).toBe(100);
    });

    it('should clamp value below min to min', () => {
      expect(clamp(-10, 0, 100)).toBe(0);
    });

    it('should handle equal min and max', () => {
      expect(clamp(50, 25, 25)).toBe(25);
    });

    it('should handle boundary values', () => {
      expect(clamp(0, 0, 100)).toBe(0);
      expect(clamp(100, 0, 100)).toBe(100);
    });
  });

  describe('calculateIntegrity', () => {
    it('should calculate inverse relationship for CoC', () => {
      const result = calculateIntegrity(20);
      expect(result.coc).toBe(80);
    });

    it('should calculate direct relationship for ERG', () => {
      const result = calculateIntegrity(20);
      expect(result.erg).toBe(20);
    });

    it('should handle saturation at 0', () => {
      const result = calculateIntegrity(0);
      expect(result.coc).toBe(100);
      expect(result.erg).toBe(0);
    });

    it('should handle saturation at 100', () => {
      const result = calculateIntegrity(100);
      expect(result.coc).toBe(0);
      expect(result.erg).toBe(100);
    });

    it('should handle saturation at 50 (balanced)', () => {
      const result = calculateIntegrity(50);
      expect(result.coc).toBe(50);
      expect(result.erg).toBe(50);
    });

    it('should clamp saturation values above 100', () => {
      const result = calculateIntegrity(150);
      expect(result.coc).toBe(0);
      expect(result.erg).toBe(100);
    });

    it('should clamp saturation values below 0', () => {
      const result = calculateIntegrity(-10);
      expect(result.coc).toBe(100);
      expect(result.erg).toBe(0);
    });
  });

  describe('getSystemState', () => {
    it('should return fractured when minIntegrity < 20', () => {
      expect(getSystemState({ coc: 10, erg: 90 })).toBe('fractured');
      expect(getSystemState({ coc: 90, erg: 10 })).toBe('fractured');
      expect(getSystemState({ coc: 19, erg: 50 })).toBe('fractured');
    });

    it('should return critical when minIntegrity >= 20 and < 40', () => {
      expect(getSystemState({ coc: 20, erg: 80 })).toBe('critical');
      expect(getSystemState({ coc: 80, erg: 20 })).toBe('critical');
      expect(getSystemState({ coc: 39, erg: 61 })).toBe('critical');
    });

    it('should return narrowed when minIntegrity >= 40 and < 80', () => {
      expect(getSystemState({ coc: 40, erg: 60 })).toBe('narrowed');
      expect(getSystemState({ coc: 60, erg: 40 })).toBe('narrowed');
      expect(getSystemState({ coc: 79, erg: 79 })).toBe('narrowed');
      expect(getSystemState({ coc: 50, erg: 50 })).toBe('narrowed');
    });

    it('should return stable when minIntegrity >= 80', () => {
      expect(getSystemState({ coc: 80, erg: 80 })).toBe('stable');
      expect(getSystemState({ coc: 100, erg: 80 })).toBe('stable');
      expect(getSystemState({ coc: 85, erg: 95 })).toBe('stable');
    });

    it('should handle boundary values correctly', () => {
      expect(getSystemState({ coc: 20, erg: 80 })).toBe('critical');
      expect(getSystemState({ coc: 40, erg: 60 })).toBe('narrowed');
      expect(getSystemState({ coc: 80, erg: 20 })).toBe('critical');
    });
  });

  describe('isCoupled', () => {
    it('should return true when both values >= default threshold (20)', () => {
      expect(isCoupled({ coc: 25, erg: 75 })).toBe(true);
      expect(isCoupled({ coc: 50, erg: 50 })).toBe(true);
      expect(isCoupled({ coc: 20, erg: 80 })).toBe(true);
    });

    it('should return false when coc < default threshold', () => {
      expect(isCoupled({ coc: 15, erg: 85 })).toBe(false);
      expect(isCoupled({ coc: 0, erg: 100 })).toBe(false);
    });

    it('should return false when erg < default threshold', () => {
      expect(isCoupled({ coc: 85, erg: 15 })).toBe(false);
      expect(isCoupled({ coc: 100, erg: 0 })).toBe(false);
    });

    it('should respect custom threshold', () => {
      expect(isCoupled({ coc: 50, erg: 50 }, 40)).toBe(true);
      expect(isCoupled({ coc: 30, erg: 70 }, 40)).toBe(false);
      expect(isCoupled({ coc: 70, erg: 30 }, 40)).toBe(false);
    });

    it('should handle boundary values with default threshold', () => {
      expect(isCoupled({ coc: 20, erg: 80 })).toBe(true);
      expect(isCoupled({ coc: 19, erg: 81 })).toBe(false);
    });
  });
});
