# Emotional Infrastructure™ SDK Documentation

Welcome to the Emotional Infrastructure™ SDK documentation. This SDK implements the EIS v1.1 standard for consent lifecycle management, emotional signal monitoring, audit logging, and trust repair metrics.

## Overview

The Emotional Infrastructure™ SDK provides developers with tools to build AI systems that respect user consent, maintain immutable audit trails, and support behavioral signal sovereignty.

### Core Features

- **Consent Lifecycle Management** — Cryptographically sound consent transaction IDs (CTIDs) and state machine-based consent tracking
- **Immutable Audit Logging** — Append-only JSONL audit trails for compliance and accountability
- **Tolerance Windows** — Emotional signal baseline and variance tracking for personalized AI interactions
- **Trust Repair Metrics** — Behavioral attribution analytics and trust delta calculations

## Getting Started

### Installation

```bash
npm install eis-sdk
```

### Basic Usage

```typescript
import { EISClient } from 'eis-sdk';

// Initialize the SDK client
const client = new EISClient({
  auditLogPath: './audit.jsonl',
});

// Grant consent
const consentId = await client.grantConsent({
  userId: 'user-123',
  scope: 'emotional-analysis',
});

// Log an audit event
await client.logAudit({
  eventType: 'consent-granted',
  userId: 'user-123',
  consentId,
});

// Calculate trust delta
const trustDelta = await client.calculateTrustDelta({
  userId: 'user-123',
  baseline: 0.8,
  current: 0.85,
});
```

## API Documentation

For detailed API documentation, see the auto-generated TypeDoc documentation:

- [Full API Reference](./api/index.html) (run `npm run docs` to generate)

## Architecture

### Module Structure

- **`consent/`** — Consent lifecycle management
  - `ctid.ts` — Consent Transaction ID generation
  - `stateMachine.ts` — State machine for consent transitions
  - `toleranceWindow.ts` — Tolerance window tracking
  
- **`audit/`** — Audit logging and validation
  - `logger.ts` — Append-only audit logger
  - `traceValidator.ts` — Audit trace validation
  
- **`repair/`** — Trust repair and metrics
  - `trustDelta.ts` — Trust delta calculations
  
- **`client.ts`** — High-level SDK client interface

### EIS v1.1 Invariants

The SDK enforces the following invariants:

1. **CTID Integrity** — Consent Transaction IDs are cryptographically unique and immutable
2. **State Machine Correctness** — Only valid consent state transitions are permitted
3. **Audit Immutability** — Audit logs are append-only and tamper-evident
4. **Tolerance Window Correctness** — Baseline and variance tracking handles all edge cases
5. **Trust Delta Stability** — Trust metrics calculations are stable and accurate

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development workflow, coding standards, and governance requirements.

## Governance

This SDK is governed by strict quality gates and invariant preservation requirements. See [Engineering Policy](./engineering-policy.md) for details.

## License

This project is licensed under the MIT License. See [LICENSE](../LICENSE) for details.

**Emotional Infrastructure™** is a trademark reserved to Brittany Wright.

## Support

- [GitHub Issues](https://github.com/Emotional-Infrastructure/eis-sdk/issues)
- [GitHub Discussions](https://github.com/Emotional-Infrastructure/eis-sdk/discussions)

---

**Version:** 0.1.1  
**Author:** Brittany Wright
