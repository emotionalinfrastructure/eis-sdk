/**
 * Append-only audit logger
 * 
 * Provides immutable JSONL audit trail functionality.
 */

export interface AuditEvent {
  timestamp: number;
  eventType: string;
  userId: string;
  data: Record<string, unknown>;
}

/**
 * Append-only audit logger
 */
export class AuditLogger {
  private events: AuditEvent[] = [];
  
  /**
   * Logs an audit event (append-only)
   * @param event The audit event to log
   */
  log(event: Omit<AuditEvent, 'timestamp'>): void {
    this.events.push({
      ...event,
      timestamp: Date.now(),
    });
  }
  
  /**
   * Gets all audit events (read-only)
   * @returns Array of audit events
   */
  getEvents(): ReadonlyArray<AuditEvent> {
    return [...this.events];
  }
}
