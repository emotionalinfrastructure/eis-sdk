import { EISClient } from '../src/client';

const SECRET = 'client-test-secret-key-12345';
const META = { platform: 'web' as const, consent_method: 'explicit' as const, geographic_region: 'US' };

describe('EISClient', () => {
  let client: EISClient;

  beforeEach(() => {
    client = new EISClient({ secret: SECRET });
  });

  describe('grantConsent', () => {
    it('returns a verified CTID v1.2 object', async () => {
      const ctid = await client.grantConsent({
        userId: 'user-123',
        dataTiers: [1, 2],
        metadata: META,
      });

      expect(ctid.version).toBe('1.2');
      expect(ctid.user_id).toBe('user-123');
      expect(ctid.data_tiers).toEqual([1, 2]);
      expect(ctid.signature).toMatch(/^[0-9a-f]{64}$/);
    });

    it('produces a CTID that passes verifyConsent', async () => {
      const ctid = await client.grantConsent({ userId: 'user-456', dataTiers: [1], metadata: META });
      expect(await client.verifyConsent(ctid)).toBe(true);
    });
  });

  describe('logAudit', () => {
    it('does not throw', async () => {
      await expect(
        client.logAudit({ eventType: 'test-event', userId: 'user-123', consentId: 'some-id' })
      ).resolves.toBeUndefined();
    });
  });

  describe('calculateTrustDelta', () => {
    it('returns correct metrics', async () => {
      const metrics = await client.calculateTrustDelta({ userId: 'user-123', baseline: 0.8, current: 0.85 });
      expect(metrics.baseline).toBe(0.8);
      expect(metrics.current).toBe(0.85);
      expect(metrics.delta).toBeCloseTo(0.05);
    });
  });
});
