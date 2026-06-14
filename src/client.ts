import { generateCTID, verifyCTID, type ConsentTransactionID, type CTIDGenerationOptions } from './consent/ctid';
import { ConsentStateMachine, ConsentState } from './consent/stateMachine';
import { AuditLogger } from './audit/logger';
import { calculateTrustDelta, TrustMetrics } from './repair/trustDelta';

export interface EISClientConfig {
  /** HMAC secret used to sign and verify CTIDs. Required. */
  secret: string;
  auditLogPath?: string;
}

export class EISClient {
  private secret: string;
  private auditLogger: AuditLogger;

  constructor(config: EISClientConfig) {
    this.secret = config.secret;
    this.auditLogger = new AuditLogger();
  }

  async grantConsent(params: {
    userId: string;
    dataTiers: number[];
    metadata: CTIDGenerationOptions['metadata'];
    parentCTID?: string | null;
  }): Promise<ConsentTransactionID> {
    const ctid = await generateCTID(this.secret, {
      userId: params.userId,
      dataTiers: params.dataTiers,
      metadata: params.metadata,
      parentCTID: params.parentCTID,
    });
    this.auditLogger.log({
      eventType: 'consent-granted',
      userId: params.userId,
      data: { ctid_session: ctid.session_id, data_tiers: ctid.data_tiers },
    });
    return ctid;
  }

  async verifyConsent(ctid: ConsentTransactionID): Promise<boolean> {
    return verifyCTID(ctid, this.secret);
  }

  async logAudit(event: { eventType: string; userId: string; consentId?: string }): Promise<void> {
    this.auditLogger.log({
      eventType: event.eventType,
      userId: event.userId,
      data: { consentId: event.consentId },
    });
  }

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
