const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

const hasWebCrypto =
  typeof globalThis !== 'undefined' &&
  globalThis.crypto != null &&
  globalThis.crypto.subtle != null;

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function hmacSha256Node(payload: string, secret: string): Promise<string> {
  const { createHmac } = await import('node:crypto');
  return createHmac('sha256', secret).update(payload).digest('hex');
}

async function hmacSha256Web(payload: string, secret: string): Promise<string> {
  const subtle = globalThis.crypto.subtle;
  const key = await subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hmacSha256(payload: string, secret: string): Promise<string> {
  if (isNode) return hmacSha256Node(payload, secret);
  if (hasWebCrypto) return hmacSha256Web(payload, secret);
  throw new Error('EIS-SDK: No native crypto available. Requires Node.js >=18 or WebCrypto.');
}

export async function verifySignature(payload: string, secret: string, signatureHex: string): Promise<boolean> {
  const expectedHex = await hmacSha256(payload, secret);
  return constantTimeEqual(hexToBytes(expectedHex), hexToBytes(signatureHex));
}

/** @internal Generate cryptographically-strong random bytes as hex. */
export async function randomBytesHex(length: number): Promise<string> {
  // Node ships a global `crypto` only from v19; use node:crypto directly so v18 works too.
  if (isNode) {
    const { randomBytes } = await import('node:crypto');
    return randomBytes(length).toString('hex');
  }
  const webcrypto = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (!webcrypto?.getRandomValues) {
    throw new Error('EIS-SDK: No secure random source available. Requires Node.js >=18 or WebCrypto.');
  }
  const buf = new Uint8Array(length);
  webcrypto.getRandomValues(buf);
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
}
