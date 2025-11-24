/**
 * Tests for trust delta calculations
 */

import { calculateTrustDelta } from '../src/repair/trustDelta';

describe('TrustDelta', () => {
  it('should calculate positive delta', () => {
    const metrics = calculateTrustDelta(0.5, 0.7);
    expect(metrics.baseline).toBe(0.5);
    expect(metrics.current).toBe(0.7);
    expect(metrics.delta).toBeCloseTo(0.2);
  });
  
  it('should calculate negative delta', () => {
    const metrics = calculateTrustDelta(0.8, 0.6);
    expect(metrics.baseline).toBe(0.8);
    expect(metrics.current).toBe(0.6);
    expect(metrics.delta).toBeCloseTo(-0.2);
  });
  
  it('should handle zero delta', () => {
    const metrics = calculateTrustDelta(0.5, 0.5);
    expect(metrics.baseline).toBe(0.5);
    expect(metrics.current).toBe(0.5);
    expect(metrics.delta).toBe(0);
  });
  
  it('should handle zero baseline and current', () => {
    const metrics = calculateTrustDelta(0, 0);
    expect(metrics.baseline).toBe(0);
    expect(metrics.current).toBe(0);
    expect(metrics.delta).toBe(0);
  });
  
  it('should handle large values', () => {
    const metrics = calculateTrustDelta(1000, 1500);
    expect(metrics.baseline).toBe(1000);
    expect(metrics.current).toBe(1500);
    expect(metrics.delta).toBe(500);
  });
});
