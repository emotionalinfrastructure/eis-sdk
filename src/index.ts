/**
 * Emotional Infrastructure™ SDK
 * 
 * This is the main entry point for the EIS SDK.
 * Exports all public APIs for consent lifecycle, audit logging, and trust repair.
 */

// Consent management
export * from './consent/ctid';
export * from './consent/stateMachine';
export * from './consent/toleranceWindow';

// Audit logging
export * from './audit/logger';
export * from './audit/traceValidator';

// Trust repair
export * from './repair/trustDelta';

// Client interface
export * from './client';
