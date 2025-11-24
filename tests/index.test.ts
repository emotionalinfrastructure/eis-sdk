/**
 * Tests for main SDK exports
 */

import * as SDK from '../src/index';

describe('SDK Exports', () => {
  it('should export CTID functions', () => {
    expect(SDK.generateCTID).toBeDefined();
    expect(SDK.validateCTID).toBeDefined();
  });
  
  it('should export consent state machine', () => {
    expect(SDK.ConsentState).toBeDefined();
    expect(SDK.ConsentStateMachine).toBeDefined();
    expect(SDK.isValidTransition).toBeDefined();
  });
  
  it('should export tolerance window functions', () => {
    expect(SDK.createToleranceWindow).toBeDefined();
    expect(SDK.isWithinTolerance).toBeDefined();
  });
  
  it('should export audit logger', () => {
    expect(SDK.AuditLogger).toBeDefined();
  });
  
  it('should export trace validator', () => {
    expect(SDK.validateTrace).toBeDefined();
  });
  
  it('should export trust delta functions', () => {
    expect(SDK.calculateTrustDelta).toBeDefined();
  });
  
  it('should export EIS client', () => {
    expect(SDK.EISClient).toBeDefined();
  });
});
