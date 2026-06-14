# Changelog

## [1.0.1] – 2026-06-14

### Added
- `src/lib/crypto.ts` — Zero-dependency native crypto adapter: dynamically imports
  `node:crypto` on Node.js ≥18, falls back to `WebCrypto` (`crypto.subtle`) in browsers.
  Constant-time HMAC verification to prevent timing attacks.
- `src/lib/utils.ts` — `canonicalStringify` (deterministic sorted-key JSON),
  ISO timestamp helpers, and CSPRNG-backed `generateSessionId` (24-char hex).
- `tsup.config.ts` — Dual CJS (`.js`) + ESM (`.mjs`) build with TypeScript declarations.
- `examples/smoke-esm.mjs` and `examples/smoke-cjs.cjs` — Post-build smoke tests
  that generate and verify a CTID against both output formats.
- `scripts/run-all-tests.sh` — Full validation script: typecheck → lint → build → test → smoke.
- `swift/console/` — Swift Package executable: complete EmotionalOS console prototype
  (SignalProcessor, ToneManager, Analytics, Vault, SessionLog, Report, SessionExporterJSON)
  sourced from the Replit bundle, with XCTest suite.
- `swift/ios/` — SwiftUI iOS app scaffold sourced from the Full CI/CD bundle:
  ContentView, WaveformView, VaultView, HistoryView, AnalyticsView, SettingsView,
  CoreDataModels, PrivacyInfo.xcprivacy, Assets/Transparency.pdf, fastlane/Fastfile.
- `.github/workflows/swift-console.yml` — Linux CI for the Swift console package
  (path-filtered to `swift/console/`).
- `.github/workflows/ios.yml` — macOS-14/Xcode-15 CI for the iOS app
  (path-filtered to `swift/ios/`).

### Changed
- `src/consent/ctid.ts` — **Breaking:** replaced placeholder string implementation with
  full async HMAC-SHA256 CTID v1.2 schema. `generateCTID` now takes `(secret, options)`
  or `(secret, dataTiers, userId, metadata, parentCTID)` and returns
  `Promise<ConsentTransactionID>`. `validateCTID` removed; use `verifyCTID` instead.
- `src/client.ts` — `EISClientConfig` now requires `secret: string`. `grantConsent`
  accepts `{ userId, dataTiers, metadata }` and returns `Promise<ConsentTransactionID>`.
  Added `verifyConsent(ctid)` method.
- `package.json` — Version bumped to `1.0.1`. Build script switched from `tsc` to `tsup`.
  Added `module`, `exports` (dual CJS/ESM), `engines` fields. DevDeps upgraded:
  Jest 29, ts-jest 29, TypeScript 5.3, ESLint 8, tsup 8, typedoc 0.25.
- `jest.config.js` — Updated jsdom `setupFilesAfterEnv` to `@testing-library/jest-dom`
  (compatible with Jest 29). Coverage reporters now include `json-summary` and `lcov`.
- `.github/workflows/ci.yml` — Updated to `actions/{checkout,setup-node}@v4`, Node 18/20
  matrix, added `dist/` static import guard and post-build smoke step.

### Removed
- `generateCTID()` (zero-arg sync overload) — replaced by the async cryptographic API.
- `validateCTID(ctid: string): boolean` — replaced by `verifyCTID(ctid, secret)`.

---

## [Unreleased] – 2025-11-24

### Added
- Local verification checklist script.
- EIS v1.1 enforcement.

---

## [0.1.1]

### Added
- CognitiveStabilitySystem UI components with pure helpers and tests.
- Consent state machine, tolerance windows, audit logger, trace validator, trust delta.
- Initial SDK deployment with TypeDoc documentation.
