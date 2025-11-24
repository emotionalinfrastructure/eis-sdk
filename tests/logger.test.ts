/**
 * Tests for audit logger
 */

import { AuditLogger } from '../src/audit/logger';

describe('AuditLogger', () => {
  it('should log audit events', () => {
    const logger = new AuditLogger();
    logger.log({
      eventType: 'test-event',
      userId: 'user-123',
      data: { key: 'value' },
    });
    
    const events = logger.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe('test-event');
    expect(events[0].userId).toBe('user-123');
    expect(events[0].timestamp).toBeDefined();
  });
  
  it('should maintain append-only semantics', () => {
    const logger = new AuditLogger();
    logger.log({
      eventType: 'event-1',
      userId: 'user-1',
      data: {},
    });
    logger.log({
      eventType: 'event-2',
      userId: 'user-2',
      data: {},
    });
    
    const events = logger.getEvents();
    expect(events).toHaveLength(2);
    expect(events[0].eventType).toBe('event-1');
    expect(events[1].eventType).toBe('event-2');
  });
  
  it('should return a copy of events array', () => {
    const logger = new AuditLogger();
    logger.log({
      eventType: 'event-1',
      userId: 'user-1',
      data: {},
    });
    
    const events = logger.getEvents();
    const originalLength = events.length;
    
    // Modifying the returned array shouldn't affect the logger's internal state
    logger.log({
      eventType: 'event-2',
      userId: 'user-2',
      data: {},
    });
    
    const newEvents = logger.getEvents();
    expect(newEvents.length).toBe(originalLength + 1);
    expect(events.length).toBe(originalLength);
  });
});
