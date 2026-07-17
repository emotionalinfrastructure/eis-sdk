import XCTest
@testable import EmotionalOS

final class SignalProcessorTests: XCTestCase {
    func testAverageOfEmptyIsZero() {
        XCTAssertEqual(SignalProcessor().average(of: []), 0.0)
    }

    func testAverageOfKnownValues() {
        XCTAssertEqual(SignalProcessor().average(of: [0.5, -0.5, 1.0, -1.0]), 0.0, accuracy: 1e-10)
    }

    func testGenerateSignalsCountAndRange() {
        let signals = SignalProcessor().generateSignals(count: 8)
        XCTAssertEqual(signals.count, 8)
        XCTAssertTrue(signals.allSatisfy { $0 >= -1.0 && $0 <= 1.0 })
    }
}

final class ToneManagerTests: XCTestCase {
    private let tone = ToneManager()

    func testCalm() { XCTAssertEqual(tone.interpretTone(from: -0.5), "Calm / Grounded") }
    func testBalanced() { XCTAssertEqual(tone.interpretTone(from: 0.0), "Balanced") }
    func testElevated() { XCTAssertEqual(tone.interpretTone(from: 0.8), "Elevated / Energized") }
}

final class AnalyticsTests: XCTestCase {
    private let analytics = Analytics()

    func testCoherenceOfConstantSignalsIsOne() {
        XCTAssertEqual(analytics.coherence(of: [0.5, 0.5, 0.5]), 1.0, accuracy: 1e-10)
    }

    func testCoherenceOfEmptyIsZero() {
        XCTAssertEqual(analytics.coherence(of: []), 0.0)
    }

    func testTrendFalling() { XCTAssertEqual(analytics.trend(of: [0.8, -0.8]), "Falling / Calming") }
    func testTrendRising() { XCTAssertEqual(analytics.trend(of: [-0.8, 0.8]), "Rising / Energizing") }
    func testTrendStable() { XCTAssertEqual(analytics.trend(of: [0.1, 0.15]), "Stable") }
}

/// In-memory test double so view-model tests never touch real disk state.
final class InMemorySessionStore: SessionStore {
    private var state = SessionStoreState()

    func load() -> SessionStoreState { state }
    func save(_ state: SessionStoreState) { self.state = state }
}

/// Deterministic signal source so view-model tests don't depend on sensors.
final class StubSignalSource: SignalSource {
    let isLive: Bool
    private let value: Double

    init(isLive: Bool = false, value: Double = 0.0) {
        self.isLive = isLive
        self.value = value
    }

    func sample(count: Int) -> [Double] {
        Array(repeating: value, count: max(0, count))
    }
}

final class MotionSignalSourceTests: XCTestCase {
    func testFallbackProducesRequestedCountInRange() {
        // No motion hardware in the simulator: the source falls back to synthetic.
        let samples = MotionSignalSource().sample(count: 12)
        XCTAssertEqual(samples.count, 12)
        XCTAssertTrue(samples.allSatisfy { $0 >= -1.0 && $0 <= 1.0 })
    }

    func testSampleOfZeroIsEmpty() {
        XCTAssertEqual(MotionSignalSource().sample(count: 0), [])
    }
}

@MainActor
final class SessionViewModelTests: XCTestCase {
    func testRunSessionPopulatesState() {
        let model = SessionViewModel(store: InMemorySessionStore())
        model.runSession()

        XCTAssertEqual(model.signals.count, model.sampleCount)
        XCTAssertEqual(model.history.count, 1)
        XCTAssertEqual(model.vaultEntries.count, 1)
        XCTAssertFalse(model.tone.isEmpty)
    }

    func testAverageCoherenceAcrossSessions() {
        let model = SessionViewModel(store: InMemorySessionStore())
        model.runSession()
        model.runSession()
        XCTAssertEqual(model.history.count, 2)
        XCTAssertGreaterThanOrEqual(model.averageCoherence, 0.0)
        XCTAssertLessThanOrEqual(model.averageCoherence, 1.0)
    }

    func testRunSessionUsesInjectedSignalSource() {
        let model = SessionViewModel(store: InMemorySessionStore(),
                                     signalSource: StubSignalSource(value: 0.5))
        model.runSession()
        XCTAssertEqual(model.signals, Array(repeating: 0.5, count: model.sampleCount))
        XCTAssertFalse(model.signalSourceIsLive)
    }

    func testSessionsPersistAcrossViewModelInstances() {
        let store = InMemorySessionStore()
        let first = SessionViewModel(store: store)
        first.runSession()
        first.runSession()

        let second = SessionViewModel(store: store)
        XCTAssertEqual(second.history, first.history)
        XCTAssertEqual(second.vaultEntries, first.vaultEntries)
    }
}

final class FileSessionStoreTests: XCTestCase {
    private func makeTemporaryFileURL() -> URL {
        FileManager.default.temporaryDirectory
            .appendingPathComponent("FileSessionStoreTests-\(UUID().uuidString).json")
    }

    func testLoadWithoutExistingFileReturnsEmptyState() {
        let store = FileSessionStore(fileURL: makeTemporaryFileURL())
        XCTAssertEqual(store.load(), SessionStoreState())
    }

    func testSaveThenLoadRoundTrips() {
        let fileURL = makeTemporaryFileURL()
        defer { try? FileManager.default.removeItem(at: fileURL) }

        let store = FileSessionStore(fileURL: fileURL)
        let record = SessionRecord(timestamp: Date(), tone: "Calm / Grounded", average: -0.5, coherence: 0.9, trend: "Stable")
        let state = SessionStoreState(history: [record], vaultEntries: ["Session 1: Calm / Grounded · coherence 0.90"])

        store.save(state)

        let reloaded = FileSessionStore(fileURL: fileURL).load()
        XCTAssertEqual(reloaded, state)
    }
}
