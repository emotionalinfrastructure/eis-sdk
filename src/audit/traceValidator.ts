/**
 * Audit trace validator
 * 
 * Validates the integrity and continuity of audit trails.
 */

import { AuditEvent } from './logger';

/**
 * Validates an audit trace for continuity and integrity
 * @param events The audit events to validate
 * @returns True if the trace is valid, false otherwise
 */
export function validateTrace(events: ReadonlyArray<AuditEvent>): boolean {
  if (events.length === 0) {
    return true;
  }
  
  // Check timestamp ordering
  for (let i = 1; i < events.length; i++) {
    if (events[i].timestamp < events[i - 1].timestamp) {
      return false;
    }
  }
  
  return true;
}
