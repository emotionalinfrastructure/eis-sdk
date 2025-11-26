/**
 * Tests for the stability module pure helper functions.
 */
import {
  clamp,
  calculateIntegrity,
  getSystemState,
  isCoupled,
  SYSTEM_STATE_DESCRIPTIONS,
  SYSTEM_STATE_COLORS,
} from '../src/lib/stability';

describe('stability helpers', () => {
  describe('clamp', () => {
    it('returns value when within range', () => {
      expect(clamp(50, 0, 100)).toBe(50);
    });

    it('clamps to min when value is below range', () => {
      expect(clamp(-10, 0, 100)).toBe(0);
    });

    it('clamps to max when value is above range', () => {
      expect(clamp(150, 0, 100)).toBe(100);
    });

    it('returns min when value equals min', () => {
      expect(clamp(0, 0, 100)).toBe(0);
    });

    it('returns max when value equals max', () => {
      expect(clamp(100, 0, 100)).toBe(100);
    });
  });

  describe('calculateIntegrity', () => {
    it('returns 100% integrity when saturation is 0%', () => {
      const result = calculateIntegrity(0);
      expect(result.erg).toBe(100);
      expect(result.coc).toBe(100);
    });

    it('returns 0% integrity when saturation is 100%', () => {
      const result = calculateIntegrity(100);
      expect(result.erg).toBe(0);
      expect(result.coc).toBe(0);
    });

    it('returns correct integrity for mid-range saturation', () => {
      const result = calculateIntegrity(30);
      expect(result.erg).toBe(70);
      expect(result.coc).toBe(70);
    });

    it('clamps saturation values above 100', () => {
      const result = calculateIntegrity(150);
      expect(result.erg).toBe(0);
      expect(result.coc).toBe(0);
    });

    it('clamps saturation values below 0', () => {
      const result = calculateIntegrity(-50);
      expect(result.erg).toBe(100);
      expect(result.coc).toBe(100);
    });
  });

  describe('getSystemState', () => {
    it('returns fractured when integrity is below 20', () => {
      expect(getSystemState({ erg: 10, coc: 10 })).toBe('fractured');
      expect(getSystemState({ erg: 0, coc: 0 })).toBe('fractured');
      expect(getSystemState({ erg: 19, coc: 19 })).toBe('fractured');
    });

    it('returns critical when integrity is between 20 and 40', () => {
      expect(getSystemState({ erg: 20, coc: 20 })).toBe('critical');
      expect(getSystemState({ erg: 30, coc: 30 })).toBe('critical');
      expect(getSystemState({ erg: 39, coc: 39 })).toBe('critical');
    });

    it('returns narrowed when integrity is between 40 and 80', () => {
      expect(getSystemState({ erg: 40, coc: 40 })).toBe('narrowed');
      expect(getSystemState({ erg: 60, coc: 60 })).toBe('narrowed');
      expect(getSystemState({ erg: 79, coc: 79 })).toBe('narrowed');
    });

    it('returns stable when integrity is 80 or above', () => {
      expect(getSystemState({ erg: 80, coc: 80 })).toBe('stable');
      expect(getSystemState({ erg: 90, coc: 90 })).toBe('stable');
      expect(getSystemState({ erg: 100, coc: 100 })).toBe('stable');
    });
  });

  describe('isCoupled', () => {
    it('returns true when integrity is at or above default threshold (20)', () => {
      expect(isCoupled({ erg: 20, coc: 20 })).toBe(true);
      expect(isCoupled({ erg: 50, coc: 50 })).toBe(true);
      expect(isCoupled({ erg: 100, coc: 100 })).toBe(true);
    });

    it('returns false when integrity is below default threshold (20)', () => {
      expect(isCoupled({ erg: 19, coc: 19 })).toBe(false);
      expect(isCoupled({ erg: 10, coc: 10 })).toBe(false);
      expect(isCoupled({ erg: 0, coc: 0 })).toBe(false);
    });

    it('respects custom threshold', () => {
      expect(isCoupled({ erg: 30, coc: 30 }, 40)).toBe(false);
      expect(isCoupled({ erg: 40, coc: 40 }, 40)).toBe(true);
      expect(isCoupled({ erg: 50, coc: 50 }, 40)).toBe(true);
    });
  });

  describe('constants', () => {
    it('SYSTEM_STATE_DESCRIPTIONS has all states', () => {
      expect(SYSTEM_STATE_DESCRIPTIONS.fractured).toBeDefined();
      expect(SYSTEM_STATE_DESCRIPTIONS.critical).toBeDefined();
      expect(SYSTEM_STATE_DESCRIPTIONS.narrowed).toBeDefined();
      expect(SYSTEM_STATE_DESCRIPTIONS.stable).toBeDefined();
    });

    it('SYSTEM_STATE_COLORS has all states', () => {
      expect(SYSTEM_STATE_COLORS.fractured).toBeDefined();
      expect(SYSTEM_STATE_COLORS.critical).toBeDefined();
      expect(SYSTEM_STATE_COLORS.narrowed).toBeDefined();
      expect(SYSTEM_STATE_COLORS.stable).toBeDefined();
    });
  });
});
