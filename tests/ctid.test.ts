/**
 * Tests for CTID generation and validation
 */

import { generateCTID, validateCTID } from '../src/consent/ctid';

describe('CTID', () => {
  describe('generateCTID', () => {
    it('should generate a valid CTID', () => {
      const ctid = generateCTID();
      expect(ctid).toBeDefined();
      expect(typeof ctid).toBe('string');
      expect(ctid.startsWith('ctid-')).toBe(true);
    });
    
    it('should generate unique CTIDs', () => {
      const ctid1 = generateCTID();
      const ctid2 = generateCTID();
      expect(ctid1).not.toBe(ctid2);
    });
  });
  
  describe('validateCTID', () => {
    it('should validate a valid CTID', () => {
      const ctid = generateCTID();
      expect(validateCTID(ctid)).toBe(true);
    });
    
    it('should reject an invalid CTID', () => {
      expect(validateCTID('invalid')).toBe(false);
      expect(validateCTID('')).toBe(false);
    });
  });
});
