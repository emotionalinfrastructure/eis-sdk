import { hmacSha256, verifySignature } from '../lib/crypto';
import { canonicalStringify, getISOTimestamp, getISOExpiry, generateSessionId } from '../lib/utils';

/** CTID schema v1.2 */
export interface ConsentTransactionID {
  version: '1.2';
  user_id: string;
  session_id: string;
  timestamp: string;
  data_tiers: number[];
  expiry: string;
  parent_ctid: string | null;
  signature: string;
  metadata: {
    platform: 'web' | 'mobile' | 'api';
    consent_method: 'explicit' | 'implicit' | 'deferred';
    geographic_region: string;
    kid?: string;
  };
}

export interface CTIDGenerationOptions {
  userId: string;
  dataTiers: number[];
  parentCTID?: string | null;
  metadata: {
    platform: 'web' | 'mobile' | 'api';
    consent_method: 'explicit' | 'implicit' | 'deferred';
    geographic_region: string;
  };
}

// Overloads
export async function generateCTID(secret: string, options: CTIDGenerationOptions): Promise<ConsentTransactionID>;
export async function generateCTID(
  secret: string,
  dataTiers: number[],
  userId: string,
  metadata?: CTIDGenerationOptions['metadata'],
  parentCTID?: string | null,
): Promise<ConsentTransactionID>;

// Implementation
export async function generateCTID(
  secret: string,
  a: CTIDGenerationOptions | number[],
  b?: string,
  c?: CTIDGenerationOptions['metadata'],
  d?: string | null,
): Promise<ConsentTransactionID> {
  if (!secret || typeof secret !== 'string') throw new Error('EIS-SDK: Missing or invalid HMAC secret');
  let opts: CTIDGenerationOptions;
  if (Array.isArray(a)) {
    opts = { userId: b as string, dataTiers: a, metadata: c!, parentCTID: d ?? null };
  } else {
    opts = a;
  }

  const payload: Omit<ConsentTransactionID, 'signature'> = {
    version: '1.2',
    user_id: opts.userId,
    session_id: await generateSessionId(),
    timestamp: getISOTimestamp(),
    expiry: getISOExpiry(30),
    data_tiers: opts.dataTiers,
    parent_ctid: opts.parentCTID ?? null,
    metadata: { ...opts.metadata },
  };

  const signature = await hmacSha256(canonicalStringify(payload), secret);
  return { ...payload, signature };
}

export async function verifyCTID(ctid: ConsentTransactionID, secret: string): Promise<boolean> {
  try {
    if (!ctid || typeof ctid !== 'object') return false;
    if (!ctid.signature || typeof ctid.signature !== 'string' || ctid.signature.length !== 64) return false;
    if (Number.isNaN(Date.parse(ctid.expiry))) return false;
    if (new Date(ctid.expiry) < new Date()) return false;
    const { signature, ...rest } = ctid;
    return await verifySignature(canonicalStringify(rest), secret, signature);
  } catch {
    return false;
  }
}
