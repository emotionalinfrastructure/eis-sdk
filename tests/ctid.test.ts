import { generateCTID, verifyCTID, type CTIDGenerationOptions } from '../src/consent/ctid';
import { canonicalStringify } from '../src/lib/utils';

const SECRET = 'test-secret-key-1234567890abcdefghijklmnopqrstuvwxyz';
const USER_ID = 'user-test-789';

const baseOptions: CTIDGenerationOptions = {
  userId: USER_ID,
  dataTiers: [1, 2],
  metadata: { platform: 'web', consent_method: 'explicit', geographic_region: 'US' },
};

describe('SPEC-1.0.0: CTID Generation & Verification (Async)', () => {
  it('creates a valid v1.2 CTID and omits kid by default', async () => {
    const ctid = await generateCTID(SECRET, baseOptions);
    expect(ctid.version).toBe('1.2');
    expect(ctid.user_id).toBe(USER_ID);
    expect(ctid.data_tiers).toEqual([1, 2]);
    expect(ctid.signature).toMatch(/^[0-9a-f]{64}$/);
    expect(ctid.parent_ctid).toBeNull();
    expect(ctid.metadata.platform).toBe('web');
    expect(ctid.metadata.kid).toBeUndefined();
  });

  it('verifies a valid CTID', async () => {
    const ctid = await generateCTID(SECRET, baseOptions);
    expect(await verifyCTID(ctid, SECRET)).toBe(true);
  });

  it('detects tampering', async () => {
    const ctid = await generateCTID(SECRET, baseOptions);
    const tampered = { ...ctid, user_id: 'hacker' };
    expect(await verifyCTID(tampered, SECRET)).toBe(false);
  });

  it('rejects wrong secret', async () => {
    const ctid = await generateCTID(SECRET, baseOptions);
    expect(await verifyCTID(ctid, 'WRONG')).toBe(false);
  });

  it('rejects expired CTID', async () => {
    const ctid = await generateCTID(SECRET, baseOptions);
    const expired = { ...ctid, expiry: new Date(Date.now() - 1000).toISOString() };
    expect(await verifyCTID(expired, SECRET)).toBe(false);
  });

  it('canonical stringify sorts keys and preserves array order', () => {
    expect(canonicalStringify({ b: 1, a: 2 })).toEqual(canonicalStringify({ a: 2, b: 1 }));
    expect(canonicalStringify({ data: [2, 1], a: 1 })).toEqual(canonicalStringify({ a: 1, data: [2, 1] }));
    expect(canonicalStringify({ a: 1, data: [2, 1] })).not.toEqual(canonicalStringify({ a: 1, data: [1, 2] }));
  });

  it('session_id is a 24-char lowercase hex string', async () => {
    const ctid = await generateCTID(SECRET, {
      userId: 'shape-user',
      dataTiers: [1],
      metadata: { platform: 'web', consent_method: 'explicit', geographic_region: 'US' },
    });
    expect(ctid.session_id).toMatch(/^[0-9a-f]{24}$/);
  });

  it('alternate positional overload produces an equivalent CTID', async () => {
    const a = await generateCTID(SECRET, baseOptions);
    const b = await generateCTID(SECRET, [1, 2], USER_ID, baseOptions.metadata, null);
    // Structure matches (timestamps will differ)
    expect(b.version).toBe('1.2');
    expect(b.user_id).toBe(USER_ID);
    expect(b.data_tiers).toEqual([1, 2]);
    expect(b.metadata.platform).toBe('web');
    expect(await verifyCTID(b, SECRET)).toBe(true);
    // Each call produces a unique session_id
    expect(a.session_id).not.toBe(b.session_id);
  });

  it('throws on missing secret', async () => {
    await expect(generateCTID('', baseOptions)).rejects.toThrow('Missing or invalid HMAC secret');
  });
});
