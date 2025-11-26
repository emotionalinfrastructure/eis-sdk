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

// Cognitive Stability System - Types and Utilities
export * from './types';
export * from './lib/stability';

// Cognitive Stability System - Components
export { CognitiveStabilitySystem } from './components/CognitiveStabilitySystem';
export { SaturationInputPanel } from './components/SaturationInputPanel';
export { CognitionPanel } from './components/CognitionPanel';
export { EmotionPanel } from './components/EmotionPanel';
export { CoupledStateLock } from './components/CoupledStateLock';
export { SystemStateSummary } from './components/SystemStateSummary';
export { FrameworkNotes } from './components/FrameworkNotes';
export { EventLog } from './components/EventLog';
