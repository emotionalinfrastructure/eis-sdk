/**
 * Tests for trace validator
 */

import { validateTrace } from '../src/audit/traceValidator';
import { AuditEvent } from '../src/audit/logger';

describe('TraceValidator', () => {
  it('should validate empty trace', () => {
    expect(validateTrace([])).toBe(true);
  });
  
  it('should validate correctly ordered trace', () => {
    const events: AuditEvent[] = [
      { timestamp: 100, eventType: 'event-1', userId: 'user-1', data: {} },
      { timestamp: 200, eventType: 'event-2', userId: 'user-1', data: {} },
      { timestamp: 300, eventType: 'event-3', userId: 'user-1', data: {} },
    ];
    expect(validateTrace(events)).toBe(true);
  });
  
  it('should reject incorrectly ordered trace', () => {
    const events: AuditEvent[] = [
      { timestamp: 100, eventType: 'event-1', userId: 'user-1', data: {} },
      { timestamp: 300, eventType: 'event-2', userId: 'user-1', data: {} },
      { timestamp: 200, eventType: 'event-3', userId: 'user-1', data: {} },
    ];
    expect(validateTrace(events)).toBe(false);
  });
  
  it('should allow equal timestamps', () => {
    const events: AuditEvent[] = [
      { timestamp: 100, eventType: 'event-1', userId: 'user-1', data: {} },
      { timestamp: 100, eventType: 'event-2', userId: 'user-1', data: {} },
    ];
    expect(validateTrace(events)).toBe(true);
  });
});
