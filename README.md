# eis-sdk

The Emotional Infrastructure Software Development Kit (EIS SDK) implements the EIS v1.1 standard for consent lifecycle management, emotional signal monitoring, audit logging, and trust repair metrics.

## v0.1.1 Release Status

This repository is **ready for v0.1.1 release**. See [Deployment Summary](docs/DEPLOYMENT-SUMMARY.md) for complete details.

### ✅ Completed
- Package configuration for npm publication
- Complete documentation (CONTRIBUTING.md, engineering policy, release notes)
- CI/CD workflows with coverage enforcement
- SDK source code and comprehensive tests (38 tests, 100% coverage)
- Security scan passed (CodeQL)
- All quality gates passing

### 📋 User Actions Required
1. Merge PR to Main branch
2. Create git tag: `git tag -a v0.1.1 -m "EIS-SDK v0.1.1"`
3. Create GitHub Release from tag
4. Publish to npm: `npm publish --access public`

See [docs/DEPLOYMENT-SUMMARY.md](docs/DEPLOYMENT-SUMMARY.md) for step-by-step instructions.

---

## Local Verification Checklist

Run the full local verification suite before opening a PR:

```bash
chmod +x ./run-checks.sh
./run-checks.sh
```

This performs the same checks enforced in CI:

1. **Environment**: Node 18/20 verification
2. **Dependencies**: npm ci
3. **Type Safety**: npx tsc --noEmit
4. **Build**: npm run build
5. **Linting**: npm run lint (auto-remediates missing ESLint packages)
6. **Tests + Coverage**: npm test + jest --coverage

Logs are saved to `./ci-local-logs/`.

This enforces EIS v1.1 invariants:
- **CTID integrity** — Cryptographically sound consent transaction IDs
- **Consent lifecycle state machine guarantees** — Valid state transitions only
- **Tolerance window correctness** — Emotional signal baseline and variance tracking
- **Audit log append-only contract** — Immutable JSONL audit trail
- **Trust delta & repair stability** — Behavioral signal sovereignty metrics

## Quick Start

```bash
# Clone the repository
git clone https://github.com/emotionalinfrastructure/eis-sdk.git
cd eis-sdk

# Install dependencies
npm install

# Run local verification
chmod +x ./run-checks.sh
./run-checks.sh

# Build the SDK
npm run build

# Run tests
npm test
```

## Project Structure

- `src/` — TypeScript source code
  - `consent/` — Consent lifecycle and CTID management
  - `audit/` — Audit logging and trace validation
  - `repair/` — Trust delta and repair metrics
  - `client.ts` — High-level EIS client
  - `index.ts` — Public SDK exports
- `tests/` — Jest test suite
- `dist/` — Compiled JavaScript and type definitions (build artifact)

## EIS v1.1 Standard

This SDK implements the Emotional Infrastructure™ v1.1 standard as specified in the Codebase Codex. All changes must preserve core invariants and pass local verification before merge.

## License

This project is licensed under the MIT License.