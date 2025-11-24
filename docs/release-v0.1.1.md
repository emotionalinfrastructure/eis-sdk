# EIS-SDK v0.1.1 Release Notes

**Release Date:** November 24, 2025  
**Version:** 0.1.1  
**Tag:** v0.1.1

## Overview

EIS-SDK v0.1.1 establishes the **governed baseline** for the Emotional Infrastructure™ SDK. This release operationalizes the EIS v1.1 standard with local verification tools, comprehensive testing, and strict governance policies.

## Release Highlights

### Local Verification & Quality Gates

- **`run-checks.sh`** — Automated local verification script that enforces the same quality gates as CI
- **Coverage Enforcement** — Jest configured with 90% line/statement/function coverage and 85% branch coverage thresholds
- **Type Safety** — TypeScript strict mode enabled across the entire codebase
- **Linting** — ESLint with TypeScript plugin for code quality and consistency

### Governance & Documentation

- **CONTRIBUTING.md** — Comprehensive contributor guidelines with governance expectations
- **Engineering Policy** — Formal engineering policy document defining quality standards and governance requirements
- **API Documentation** — TypeDoc-based documentation generation
- **Release Notes** — Structured release notes for version tracking

### npm Publication Readiness

- Package metadata configured for npm publication
- Build artifacts properly configured in `package.json` files array
- `.npmignore` configured to exclude source files and dev artifacts
- Repository, bugs, and homepage URLs properly set

### CI/CD Infrastructure

- Reusable CI workflow for stack integration
- GitHub Actions workflow with coverage reporting
- Automated quality gate enforcement

## Core Features (EIS v1.1 Standard)

This release implements the complete EIS v1.1 standard:

### Consent Lifecycle Management

- **CTID Generation** — Cryptographically sound Consent Transaction IDs
- **State Machine** — Valid consent state transitions (pending → granted → revoked)
- **Tolerance Windows** — Emotional signal baseline and variance tracking

### Audit & Integrity

- **Append-Only Audit Logging** — Immutable JSONL audit trails
- **Trace Validation** — Audit trail continuity and integrity validation
- **Tamper Detection** — Cryptographic integrity checks

### Trust Repair & Metrics

- **Trust Delta Calculations** — Behavioral attribution analytics
- **Repair Metrics** — Trust repair tracking and reporting
- **Edge Case Handling** — Zero baselines, overflow, and underflow protection

### Client Interface

- **High-Level SDK Client** — Simple, ergonomic API for common operations
- **TypeScript Support** — Full type definitions and intellisense
- **Error Handling** — Comprehensive error types and messages

## Breaking Changes

None (initial baseline release)

## Deprecations

None

## Known Issues

None

## Upgrade Guide

This is the initial baseline release. For future upgrades, see migration guides in the documentation.

## Installation

```bash
npm install eis-sdk@0.1.1
```

## Verification

After installation, verify the package:

```bash
npm info eis-sdk
```

Expected output should show version `0.1.1` with proper metadata.

## Documentation

- [API Documentation](./index.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Engineering Policy](./engineering-policy.md)

## Governance Commitments

This release establishes the following governance commitments:

1. **Invariant Preservation** — Core EIS v1.1 invariants must never be weakened
2. **Quality Gates** — All changes must pass type checking, linting, tests, and coverage thresholds
3. **Security First** — No credentials in code, proper input validation, secure error handling
4. **Semantic Versioning** — Strict adherence to semver for version numbering
5. **Backward Compatibility** — Breaking changes require major version bump and migration guide

## Contributors

- Brittany Wright (Author & Maintainer)

## License

MIT License

**Emotional Infrastructure™** is a trademark reserved to Brittany Wright.

## Next Steps

- Publish to npm registry (`npm publish --access public`)
- Create GitHub Release with tag `v0.1.1`
- Monitor for issues and feedback
- Plan for v0.2.0 feature enhancements

---

For questions or issues, please visit:
- [GitHub Issues](https://github.com/Emotional-Infrastructure/eis-sdk/issues)
- [GitHub Discussions](https://github.com/Emotional-Infrastructure/eis-sdk/discussions)
