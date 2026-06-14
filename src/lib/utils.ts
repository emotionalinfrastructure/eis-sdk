import { randomBytesHex } from './crypto';

function sortKeys(o: unknown): unknown {
  if (o === null || typeof o !== 'object') return o;
  if (Array.isArray(o)) return o.map(sortKeys);
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(o as object).sort()) out[k] = sortKeys((o as Record<string, unknown>)[k]);
  return out;
}

export function canonicalStringify(obj: unknown): string {
  return JSON.stringify(sortKeys(obj));
}

export function getISOTimestamp(date: Date = new Date()): string {
  return date.toISOString();
}

export function getISOExpiry(days = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function generateSessionId(): Promise<string> {
  return randomBytesHex(12); // 12 bytes → 24 hex chars
}
