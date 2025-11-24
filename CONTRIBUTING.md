# Contributing to Emotional Infrastructure™ SDK

Thank you for your interest in contributing to the Emotional Infrastructure™ SDK. This document outlines the development workflow, governance requirements, and coding standards for this project.

## Development Workflow

### Branching Strategy

- The `Main` branch is the governed baseline for production releases
- Create feature branches from `Main` using descriptive names (e.g., `feature/consent-enhancement`, `fix/audit-log-bug`)
- All changes must go through Pull Request (PR) review before merging to `Main`

### Local Verification

Before opening a PR, **always** run the full local verification suite:

```bash
chmod +x ./run-checks.sh
./run-checks.sh
```

This script performs the same checks enforced in CI:

1. **Environment verification** — Node 18/20 compatibility
2. **Dependencies** — `npm ci`
3. **Type Safety** — `npx tsc --noEmit`
4. **Build** — `npm run build`
5. **Linting** — `npm run lint`
6. **Tests + Coverage** — `npm test` and `jest --coverage`

Logs are saved to `./ci-local-logs/` for debugging.

### Pull Request Expectations

- PRs must pass all CI checks (type checking, linting, tests, coverage thresholds)
- PRs should include tests for new functionality
- PRs must preserve all EIS v1.1 invariants (see below)
- Commit messages should be clear and descriptive
- PR descriptions should explain the rationale and impact of changes

## Invariant-Sensitive Areas

The following modules implement core EIS v1.1 invariants and require **extra scrutiny** during review. Changes to these areas must not weaken consent, audit, or integrity guarantees:

### Consent Management

- **`src/consent/ctid.ts`** — Cryptographically sound Consent Transaction IDs (CTIDs). Any changes must preserve CTID uniqueness, immutability, and cryptographic integrity.
- **`src/consent/stateMachine.ts`** — Consent lifecycle state transitions. Only valid state transitions are permitted (e.g., `granted → revoked`, `pending → granted`). Invalid transitions must be rejected.
- **`src/consent/toleranceWindow.ts`** — Emotional signal baseline and variance tracking. Tolerance windows establish behavioral baselines and must handle edge cases correctly.

### Audit & Integrity

- **`src/audit/logger.ts`** — Append-only audit logging. Audit logs must be immutable and tamper-evident. No deletion or modification of existing entries is allowed.
- **`src/audit/traceValidator.ts`** — Trace validation for audit integrity. Ensures continuity and correctness of audit trails.

### Trust & Repair

- **`src/repair/trustDelta.ts`** — Trust delta calculations and repair metrics. These metrics support behavioral signal sovereignty and must handle edge cases (zero baselines, overflow, underflow) correctly.

### Client Interface

- **`src/client.ts`** — High-level SDK client interface. Changes here affect all downstream consumers and must maintain backward compatibility where possible.

## Coding Standards

### TypeScript Strict Mode

- All code must compile under TypeScript strict mode (`"strict": true` in `tsconfig.json`)
- Avoid `any` types; use proper type annotations
- Handle nullable types explicitly (`null`, `undefined`)

### Linting

- Code must pass ESLint with zero errors
- Use consistent formatting (2-space indentation, single quotes for strings)
- Follow existing code style and conventions

### Testing

- All new functionality must include unit tests
- Tests must achieve the coverage thresholds defined in `jest.config.js`:
  - Lines: 90%
  - Statements: 90%
  - Functions: 90%
  - Branches: 85%
- Edge cases and error conditions must be tested

### Build

- Code must build without errors (`npm run build`)
- No TypeScript compilation errors or warnings

## Governance Expectations

### No Weakening of Core Guarantees

Changes must **never** weaken the following guarantees:

1. **Consent integrity** — CTIDs must remain cryptographically sound and immutable
2. **Audit immutability** — Audit logs must remain append-only and tamper-evident
3. **State machine correctness** — Only valid consent state transitions are permitted
4. **Trust metrics stability** — Trust delta calculations must handle all edge cases correctly

### Security-First Development

- No credentials or secrets in source code
- Input validation for all external data
- Proper error handling without information leakage
- Follow secure coding practices (e.g., OWASP guidelines)

### Breaking Changes

- Breaking changes to the public API require major version bump (semantic versioning)
- Deprecation warnings must be added before removing functionality
- Migration guides must be provided for breaking changes

## Licensing & Intellectual Property

### Authorship

- **Emotional Infrastructure™** is a trademark reserved to Brittany Wright
- All contributions are made under the MIT License (see LICENSE file)
- By contributing, you agree that your contributions will be licensed under the MIT License

### Copyright

- Original authorship and design of the Emotional Infrastructure™ SDK is credited to Brittany Wright
- Contributors retain copyright for their contributions but grant an MIT license to the project

### Trademark Usage

- The term "Emotional Infrastructure™" may not be used in derivative works without permission
- Forks and derivative projects must use distinct names and branding

## Code Review Process

1. Submit a PR with a clear description of changes
2. Ensure all CI checks pass
3. Address review feedback promptly
4. Obtain approval from at least one maintainer
5. Merge only after all discussions are resolved

## Questions or Issues?

- Open an issue on GitHub for bug reports or feature requests
- Use the `severity:governance` label for issues affecting invariants or core guarantees
- For security vulnerabilities, please report privately via the repository security policy

---

Thank you for contributing to the Emotional Infrastructure™ SDK!
