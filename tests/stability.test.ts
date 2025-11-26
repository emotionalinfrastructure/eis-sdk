/**
 * Tests for the stability module pure helper functions.
 */
import {
  clamp,
  calculateIntegrity,
  getSystemState,
  isCoupled,
  getIntegrityLabel,
  getIntegrityColorClass,
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

  describe('getIntegrityLabel', () => {
    it('returns Severely Impaired for values below 20', () => {
      expect(getIntegrityLabel(0)).toBe('Severely Impaired');
      expect(getIntegrityLabel(10)).toBe('Severely Impaired');
      expect(getIntegrityLabel(19)).toBe('Severely Impaired');
    });

    it('returns Critically Low for values 20-39', () => {
      expect(getIntegrityLabel(20)).toBe('Critically Low');
      expect(getIntegrityLabel(30)).toBe('Critically Low');
      expect(getIntegrityLabel(39)).toBe('Critically Low');
    });

    it('returns Moderately Reduced for values 40-59', () => {
      expect(getIntegrityLabel(40)).toBe('Moderately Reduced');
      expect(getIntegrityLabel(50)).toBe('Moderately Reduced');
      expect(getIntegrityLabel(59)).toBe('Moderately Reduced');
    });

    it('returns Slightly Reduced for values 60-79', () => {
      expect(getIntegrityLabel(60)).toBe('Slightly Reduced');
      expect(getIntegrityLabel(70)).toBe('Slightly Reduced');
      expect(getIntegrityLabel(79)).toBe('Slightly Reduced');
    });

    it('returns Optimal for values 80 and above', () => {
      expect(getIntegrityLabel(80)).toBe('Optimal');
      expect(getIntegrityLabel(90)).toBe('Optimal');
      expect(getIntegrityLabel(100)).toBe('Optimal');
    });
  });

  describe('getIntegrityColorClass', () => {
    it('returns text-red-600 for values below 20', () => {
      expect(getIntegrityColorClass(0)).toBe('text-red-600');
      expect(getIntegrityColorClass(10)).toBe('text-red-600');
      expect(getIntegrityColorClass(19)).toBe('text-red-600');
    });

    it('returns text-orange-500 for values 20-39', () => {
      expect(getIntegrityColorClass(20)).toBe('text-orange-500');
      expect(getIntegrityColorClass(30)).toBe('text-orange-500');
      expect(getIntegrityColorClass(39)).toBe('text-orange-500');
    });

    it('returns text-yellow-600 for values 40-59', () => {
      expect(getIntegrityColorClass(40)).toBe('text-yellow-600');
      expect(getIntegrityColorClass(50)).toBe('text-yellow-600');
      expect(getIntegrityColorClass(59)).toBe('text-yellow-600');
    });

    it('returns text-yellow-500 for values 60-79', () => {
      expect(getIntegrityColorClass(60)).toBe('text-yellow-500');
      expect(getIntegrityColorClass(70)).toBe('text-yellow-500');
      expect(getIntegrityColorClass(79)).toBe('text-yellow-500');
    });

    it('returns text-green-600 for values 80 and above', () => {
      expect(getIntegrityColorClass(80)).toBe('text-green-600');
      expect(getIntegrityColorClass(90)).toBe('text-green-600');
      expect(getIntegrityColorClass(100)).toBe('text-green-600');
    });
  });
});
