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
    @Published var sampleCount = 10

    private let processor = SignalProcessor()
    private let toneManager = ToneManager()
    private let analytics = Analytics()
    private let store: SessionStore
    private let signalSource: SignalSource

    init(store: SessionStore = FileSessionStore(),
         signalSource: SignalSource = MotionSignalSource()) {
        self.store = store
        self.signalSource = signalSource
        let state = store.load()
        history = state.history
        vaultEntries = state.vaultEntries
    }

    /// Whether sessions are currently driven by live device-motion sensors.
    var signalSourceIsLive: Bool { signalSource.isLive }

    /// Runs one full pipeline pass and appends the result to history and the vault.
    func runSession() {
        let samples = signalSource.sample(count: sampleCount)
        signals = samples
        average = processor.average(of: samples)
        tone = toneManager.interpretTone(from: average)
        coherence = analytics.coherence(of: samples)
        trend = analytics.trend(of: samples)

        history.append(
            SessionRecord(timestamp: Date(), tone: tone, average: average, coherence: coherence, trend: trend)
        )
        vaultEntries.append("Session \(history.count): \(tone) · coherence \(String(format: "%.2f", coherence))")

        store.save(SessionStoreState(history: history, vaultEntries: vaultEntries))
    }

    /// Mean coherence across all recorded sessions.
    var averageCoherence: Double {
        guard !history.isEmpty else { return 0 }
        return history.map(\.coherence).reduce(0, +) / Double(history.count)
    }
}
