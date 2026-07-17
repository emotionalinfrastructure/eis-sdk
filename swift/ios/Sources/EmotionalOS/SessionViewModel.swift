import Foundation

/// Owns session state and drives the analysis pipeline for the UI.
@MainActor
final class SessionViewModel: ObservableObject {
    @Published private(set) var signals: [Double] = []
    @Published private(set) var average = 0.0
    @Published private(set) var tone = "—"
    @Published private(set) var coherence = 0.0
    @Published private(set) var trend = "Neutral"
    @Published private(set) var history: [SessionRecord] = []
    @Published private(set) var vaultEntries: [String] = []
    @Published private(set) var consentState: ConsentState
    @Published private(set) var auditEvents: [AuditEvent] = []
    @Published private(set) var lastCTID: ConsentTransactionID?
    @Published var sampleCount = 10

    private let processor = SignalProcessor()
    private let toneManager = ToneManager()
    private let analytics = Analytics()
    private let store: SessionStore
    private let signalSource: SignalSource
    private let consent: ConsentStateMachine
    private let audit: AuditLogger
    private let ctidService: CTIDService
    private let userId: String

    init(store: SessionStore = FileSessionStore(),
         signalSource: SignalSource = MotionSignalSource(),
         consent: ConsentStateMachine = ConsentStateMachine(),
         audit: AuditLogger = AuditLogger(),
         ctidService: CTIDService = CTIDService(secret: CTIDService.defaultSecret),
         userId: String = "local-user") {
        self.store = store
        self.signalSource = signalSource
        self.consent = consent
        self.audit = audit
        self.ctidService = ctidService
        self.userId = userId
        consentState = consent.state
        let state = store.load()
        history = state.history
        vaultEntries = state.vaultEntries
    }

    /// Whether sessions are currently driven by live device-motion sensors.
    var signalSourceIsLive: Bool { signalSource.isLive }

    /// Grants consent, unlocking session runs and recording an audit event.
    func grantConsent() {
        guard consent.transition(to: .granted) else { return }
        consentState = consent.state
        audit.log(eventType: "consent_granted", userId: userId)
        auditEvents = audit.events
    }

    /// Revokes consent, blocking further session runs and recording an audit event.
    func revokeConsent() {
        guard consent.transition(to: .revoked) else { return }
        consentState = consent.state
        audit.log(eventType: "consent_revoked", userId: userId)
        auditEvents = audit.events
    }

    /// Runs one full pipeline pass and appends the result to history and the vault.
    ///
    /// Sessions are gated on granted consent; a blocked run is recorded in the
    /// audit trail and otherwise has no effect.
    func runSession() {
        guard consentState == .granted else {
            audit.log(eventType: "session_blocked", userId: userId, data: ["reason": "consent_not_granted"])
            auditEvents = audit.events
            return
        }

        let samples = signalSource.sample(count: sampleCount)
        signals = samples
        average = processor.average(of: samples)
        tone = toneManager.interpretTone(from: average)
        coherence = analytics.coherence(of: samples)
        trend = analytics.trend(of: samples)

        let ctid = try? ctidService.generate(
            userId: userId,
            dataTiers: [1],
            metadata: .init(platform: "mobile",
                            consentMethod: "explicit",
                            geographicRegion: "unknown",
                            kid: nil)
        )
        lastCTID = ctid

        history.append(
            SessionRecord(timestamp: Date(), tone: tone, average: average,
                          coherence: coherence, trend: trend, ctid: ctid?.signature)
        )
        vaultEntries.append("Session \(history.count): \(tone) · coherence \(String(format: "%.2f", coherence))")

        audit.log(eventType: "session_run", userId: userId,
                  data: ["tone": tone, "ctid": ctid?.signature ?? ""])
        auditEvents = audit.events

        store.save(SessionStoreState(history: history, vaultEntries: vaultEntries))
    }

    /// Mean coherence across all recorded sessions.
    var averageCoherence: Double {
        guard !history.isEmpty else { return 0 }
        return history.map(\.coherence).reduce(0, +) / Double(history.count)
    }
}
