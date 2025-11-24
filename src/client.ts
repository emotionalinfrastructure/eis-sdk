/**
 * EIS SDK Client
 * 
 * High-level client interface for the Emotional Infrastructure™ SDK.
 */

import { generateCTID } from './consent/ctid';
import { ConsentStateMachine, ConsentState } from './consent/stateMachine';
import { AuditLogger } from './audit/logger';
import { calculateTrustDelta, TrustMetrics } from './repair/trustDelta';

export interface EISClientConfig {
  auditLogPath?: string;
}

/**
 * High-level EIS SDK client
 */
export class EISClient {
  private auditLogger: AuditLogger;
  
  constructor(_config: EISClientConfig) {
    this.auditLogger = new AuditLogger();
  }
  
  /**
   * Grants consent and returns a CTID
   * @param params Consent parameters
   * @returns Consent transaction ID
   */
  async grantConsent(params: { userId: string; scope: string }): Promise<string> {
    const ctid = generateCTID();
    this.auditLogger.log({
      eventType: 'consent-granted',
      userId: params.userId,
      data: { ctid, scope: params.scope },
    });
    return ctid;
  }
  
  /**
   * Logs an audit event
   * @param event The event to log
   */
  async logAudit(event: { eventType: string; userId: string; consentId?: string }): Promise<void> {
    this.auditLogger.log({
      eventType: event.eventType,
      userId: event.userId,
      data: { consentId: event.consentId },
    });
  }
  
  /**
   * Calculates trust delta
   * @param params Trust calculation parameters
   * @returns Trust metrics
   */
  async calculateTrustDelta(params: { userId: string; baseline: number; current: number }): Promise<TrustMetrics> {
    const metrics = calculateTrustDelta(params.baseline, params.current);
    this.auditLogger.log({
      eventType: 'trust-delta-calculated',
      userId: params.userId,
      data: { ...metrics },
    });
    return metrics;
  }
}

export { ConsentState, ConsentStateMachine };
