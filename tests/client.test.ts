/**
 * Tests for EIS Client
 */

import { EISClient } from '../src/client';

describe('EISClient', () => {
  let client: EISClient;
  
  beforeEach(() => {
    client = new EISClient({ auditLogPath: './test-audit.jsonl' });
  });
  
  describe('grantConsent', () => {
    it('should grant consent and return CTID', async () => {
      const ctid = await client.grantConsent({
        userId: 'user-123',
        scope: 'emotional-analysis',
      });
      
      expect(ctid).toBeDefined();
      expect(typeof ctid).toBe('string');
      expect(ctid.startsWith('ctid-')).toBe(true);
    });
  });
  
  describe('logAudit', () => {
    it('should log audit event', async () => {
      await client.logAudit({
        eventType: 'test-event',
        userId: 'user-123',
        consentId: 'ctid-123',
      });
      
      // If this doesn't throw, the test passes
      expect(true).toBe(true);
    });
  });
  
  describe('calculateTrustDelta', () => {
    it('should calculate trust delta', async () => {
      const metrics = await client.calculateTrustDelta({
        userId: 'user-123',
        baseline: 0.8,
        current: 0.85,
      });
      
      expect(metrics.baseline).toBe(0.8);
      expect(metrics.current).toBe(0.85);
      expect(metrics.delta).toBeCloseTo(0.05);
    });
  });
});
