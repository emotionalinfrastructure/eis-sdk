/**
 * Tests for consent state machine
 */

import { ConsentState, ConsentStateMachine, isValidTransition } from '../src/consent/stateMachine';

describe('ConsentStateMachine', () => {
  describe('isValidTransition', () => {
    it('should allow pending to granted transition', () => {
      expect(isValidTransition(ConsentState.PENDING, ConsentState.GRANTED)).toBe(true);
    });
    
    it('should allow pending to revoked transition', () => {
      expect(isValidTransition(ConsentState.PENDING, ConsentState.REVOKED)).toBe(true);
    });
    
    it('should allow granted to revoked transition', () => {
      expect(isValidTransition(ConsentState.GRANTED, ConsentState.REVOKED)).toBe(true);
    });
    
    it('should allow granted to expired transition', () => {
      expect(isValidTransition(ConsentState.GRANTED, ConsentState.EXPIRED)).toBe(true);
    });
    
    it('should reject invalid transitions', () => {
      expect(isValidTransition(ConsentState.REVOKED, ConsentState.GRANTED)).toBe(false);
      expect(isValidTransition(ConsentState.EXPIRED, ConsentState.GRANTED)).toBe(false);
    });
  });
  
  describe('ConsentStateMachine', () => {
    it('should start in pending state by default', () => {
      const machine = new ConsentStateMachine();
      expect(machine.getState()).toBe(ConsentState.PENDING);
    });
    
    it('should transition to granted state', () => {
      const machine = new ConsentStateMachine();
      const result = machine.transition(ConsentState.GRANTED);
      expect(result).toBe(true);
      expect(machine.getState()).toBe(ConsentState.GRANTED);
    });
    
    it('should reject invalid transitions', () => {
      const machine = new ConsentStateMachine(ConsentState.REVOKED);
      const result = machine.transition(ConsentState.GRANTED);
      expect(result).toBe(false);
      expect(machine.getState()).toBe(ConsentState.REVOKED);
    });
  });
});
