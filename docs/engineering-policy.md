# Engineering Policy — Emotional Infrastructure™ SDK

**Version:** 1.0  
**Effective Date:** November 24, 2025  
**Last Updated:** November 24, 2025

## Purpose & Scope

This document defines the engineering standards, quality gates, and governance requirements for the Emotional Infrastructure™ SDK (eis-sdk). All contributors, maintainers, and integrators must adhere to these policies.

### Scope

This policy applies to:
- Core SDK codebase (`eis-sdk`)
- Enterprise variant (`eis-sdk-pro`)
- Dependent applications integrating the SDK
- CI/CD pipelines and automation

## Semantic Versioning Requirements

### Version Numbering

The SDK follows [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** — Incompatible API changes or breaking changes
- **MINOR** — Backward-compatible functionality additions
- **PATCH** — Backward-compatible bug fixes

### Version Bump Triggers

- **MAJOR bump required when:**
  - Public API signatures change in incompatible ways
  - Invariants are strengthened in ways that break existing usage
  - Configuration formats change incompatibly
  - Dependencies change with breaking changes

- **MINOR bump required when:**
  - New public APIs are added
  - New features are introduced
  - Optional parameters are added to existing APIs
  - Deprecation warnings are added

- **PATCH bump required when:**
  - Bugs are fixed without changing public API
  - Documentation is improved
  - Internal refactoring occurs without API changes

### Pre-release Versions

- Use `-alpha`, `-beta`, `-rc` suffixes for pre-release versions
- Pre-release versions do not guarantee stability or backward compatibility

## Quality Gates

All code changes must pass the following quality gates before merge:

### 1. Type Safety

- **Tool:** TypeScript compiler (`tsc`)
- **Command:** `npx tsc --noEmit`
- **Requirement:** Zero type errors
- **Configuration:** `strict: true` in `tsconfig.json`

**Rationale:** Type safety prevents runtime errors and improves code maintainability.

### 2. Build

- **Tool:** TypeScript compiler (`tsc`)
- **Command:** `npm run build`
- **Requirement:** Successful compilation to `dist/` directory
- **Outputs:** JavaScript files and type declaration files (`.d.ts`)

**Rationale:** Ensures the SDK can be consumed by downstream applications.

### 3. Linting

- **Tool:** ESLint with TypeScript plugin
- **Command:** `npm run lint`
- **Requirement:** Zero linting errors
- **Configuration:** `.eslintrc.js` or ESLint config in `package.json`

**Rationale:** Enforces code quality, consistency, and best practices.

### 4. Testing

- **Tool:** Jest
- **Command:** `npm test`
- **Requirement:** All tests pass (100% pass rate)
- **Test Location:** `tests/**/*.test.ts`

**Rationale:** Validates correctness of functionality and prevents regressions.

### 5. Coverage

- **Tool:** Jest with coverage reporting
- **Command:** `npx jest --coverage`
- **Thresholds:**
  - **Lines:** 90%
  - **Statements:** 90%
  - **Functions:** 90%
  - **Branches:** 85%

**Rationale:** Ensures comprehensive testing of code paths and edge cases.

### Local Verification

Developers must run `./run-checks.sh` before opening a PR. This script executes all quality gates locally and saves logs to `./ci-local-logs/`.

### CI Enforcement

GitHub Actions CI pipeline enforces all quality gates on every PR and commit to `Main`. PRs cannot be merged until all checks pass.

## Governance Requirements for Consent, Audit, and Signal Logic

### Invariant-Sensitive Modules

The following modules implement EIS v1.1 invariants and require **governance review** for all changes:

#### Consent Management

1. **`src/consent/ctid.ts`**
   - **Invariant:** CTIDs must be cryptographically unique and immutable
   - **Governance Rule:** No changes that weaken uniqueness or cryptographic properties
   - **Review Requirement:** Security review for any CTID generation changes

2. **`src/consent/stateMachine.ts`**
   - **Invariant:** Only valid state transitions are permitted
   - **Governance Rule:** State transition logic must be formally validated
   - **Review Requirement:** Logic verification for any state machine changes

3. **`src/consent/toleranceWindow.ts`**
   - **Invariant:** Tolerance windows handle all edge cases correctly
   - **Governance Rule:** Edge case testing required for all changes
   - **Review Requirement:** Behavioral testing for boundary conditions

#### Audit & Integrity

4. **`src/audit/logger.ts`**
   - **Invariant:** Audit logs are append-only and immutable
   - **Governance Rule:** No deletion or modification of existing log entries
   - **Review Requirement:** Immutability verification for any logger changes

5. **`src/audit/traceValidator.ts`**
   - **Invariant:** Audit traces are continuous and validated
   - **Governance Rule:** Validation logic must detect all tampering attempts
   - **Review Requirement:** Security review for validation logic changes

#### Trust & Repair

6. **`src/repair/trustDelta.ts`**
   - **Invariant:** Trust delta calculations are stable and accurate
   - **Governance Rule:** Edge cases (zero baselines, overflow, underflow) must be handled
   - **Review Requirement:** Numerical stability testing for all changes

#### Client Interface

7. **`src/client.ts`**
   - **Invariant:** High-level client maintains backward compatibility
   - **Governance Rule:** Breaking changes require major version bump
   - **Review Requirement:** API compatibility review for all changes

### Prohibited Changes

The following changes are **prohibited** without explicit governance approval:

- Weakening of cryptographic guarantees in CTID generation
- Allowing invalid consent state transitions
- Modification or deletion of audit log entries
- Removal of edge case handling in tolerance windows or trust deltas
- Breaking changes to public APIs without major version bump

### Governance Review Process

1. Changes to invariant-sensitive modules trigger `severity:governance` label
2. Governance review includes:
   - Code review by at least two maintainers
   - Security review for cryptographic or audit changes
   - Test coverage review (must meet or exceed thresholds)
   - Invariant preservation verification
3. Governance approval required before merge

## Coding Standards

### TypeScript

- Use TypeScript strict mode (`"strict": true`)
- Avoid `any` types; use explicit type annotations
- Handle nullable types explicitly (`null`, `undefined`)
- Use interfaces for public APIs, types for internal structures

### Code Style

- 2-space indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multi-line structures
- Follow existing code patterns in the repository

### Documentation

- Public APIs must have TSDoc comments
- Complex logic must have inline comments explaining rationale
- README and documentation must be kept up to date

### Testing

- Unit tests required for all new functionality
- Edge cases and error conditions must be tested
- Tests must be deterministic (no flaky tests)
- Test naming: `describe('ModuleName', () => { it('should do X', () => { ... }) })`

## Intellectual Property & Authorship

### Trademark

- **Emotional Infrastructure™** is a trademark reserved to Brittany Wright
- Usage in derivative works requires permission
- Forks must use distinct names and branding

### Copyright

- Original design and authorship: Brittany Wright
- Contributors retain copyright for contributions
- All contributions licensed under MIT License

### License

- Project is licensed under MIT License
- See LICENSE file for full terms
- Contributors agree to MIT licensing by contributing

## Incident & Regression Handling

### Severity Levels

- **severity:critical** — Security vulnerabilities, data loss, or invariant violations
- **severity:high** — Major functionality broken, widespread impact
- **severity:medium** — Specific features broken, limited impact
- **severity:low** — Minor bugs, cosmetic issues
- **severity:governance** — Changes affecting core invariants or governance policies

### Response SLAs

- **Critical:** Immediate response, hotfix within 24 hours
- **High:** Response within 24 hours, fix within 1 week
- **Medium:** Response within 1 week, fix within 2 weeks
- **Low:** Response within 2 weeks, fix in next release

### Regression Handling

1. **Detection:** Automated tests catch regressions in CI
2. **Triage:** Determine severity and assign to maintainer
3. **Fix:** Create fix PR with regression test
4. **Verification:** Ensure fix passes all quality gates
5. **Release:** Patch release for critical/high severity, next minor/major for others

### Hotfix Process

For critical security or invariant violations:
1. Create hotfix branch from latest release tag
2. Apply minimal fix with targeted tests
3. Fast-track review (expedited governance review)
4. Patch version bump and immediate release
5. Backport to `Main` if needed

## Version History

- **1.0** (2025-11-24) — Initial engineering policy for v0.1.1 baseline

## Approval

This policy is approved and maintained by:
- **Author & Maintainer:** Brittany Wright

## Questions?

For questions about this policy, open an issue with the `governance` label or contact the maintainers via GitHub Discussions.

---

**Emotional Infrastructure™ SDK Engineering Policy v1.0**  
**© 2025 Brittany Wright. All rights reserved.**
