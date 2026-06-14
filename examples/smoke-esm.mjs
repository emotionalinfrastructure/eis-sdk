import { generateCTID, verifyCTID } from '../dist/index.mjs';

const SECRET = 'smoke-test-secret';
console.log('Running ESM smoke test...');

const ctid = await generateCTID(SECRET, {
  userId: 'user-esm-smoke',
  dataTiers: [1, 2],
  metadata: { platform: 'web', consent_method: 'explicit', geographic_region: 'US' },
});

console.log('  Generated CTID, version:', ctid.version);
console.log('  kid omitted:', ctid.metadata.kid === undefined);
console.log('  signature:', ctid.signature.substring(0, 16) + '...');

const isValid = await verifyCTID(ctid, SECRET);
console.log('  Verification:', isValid);
if (!isValid) process.exit(1);
console.log('ESM smoke test passed!');
