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
        model.grantConsent()
        model.runSession()

        XCTAssertEqual(model.signals.count, model.sampleCount)
        XCTAssertEqual(model.history.count, 1)
        XCTAssertEqual(model.vaultEntries.count, 1)
        XCTAssertFalse(model.tone.isEmpty)
    }

    func testAverageCoherenceAcrossSessions() {
        let model = SessionViewModel(store: InMemorySessionStore())
        model.grantConsent()
        model.runSession()
        model.runSession()
        XCTAssertEqual(model.history.count, 2)
        XCTAssertGreaterThanOrEqual(model.averageCoherence, 0.0)
        XCTAssertLessThanOrEqual(model.averageCoherence, 1.0)
    }

    func testRunSessionUsesInjectedSignalSource() {
        let model = SessionViewModel(store: InMemorySessionStore(),
                                     signalSource: StubSignalSource(value: 0.5))
        model.grantConsent()
        model.runSession()
        XCTAssertEqual(model.signals, Array(repeating: 0.5, count: model.sampleCount))
        XCTAssertFalse(model.signalSourceIsLive)
    }

    func testSessionsPersistAcrossViewModelInstances() {
        let store = InMemorySessionStore()
        let first = SessionViewModel(store: store)
        first.grantConsent()
        first.runSession()
        first.runSession()

        let second = SessionViewModel(store: store)
        XCTAssertEqual(second.history, first.history)
        XCTAssertEqual(second.vaultEntries, first.vaultEntries)
    }

    func testRunSessionBlockedWithoutConsent() {
        let model = SessionViewModel(store: InMemorySessionStore())
        model.runSession()

        XCTAssertEqual(model.consentState, .pending)
        XCTAssertTrue(model.history.isEmpty)
        XCTAssertTrue(model.vaultEntries.isEmpty)
        XCTAssertEqual(model.auditEvents.map(\.eventType), ["session_blocked"])
    }

    func testConsentGateAndAuditTrail() {
        let model = SessionViewModel(store: InMemorySessionStore(),
                                     signalSource: StubSignalSource(value: 0.2))
        model.grantConsent()
        XCTAssertEqual(model.consentState, .granted)

        model.runSession()
        XCTAssertEqual(model.history.count, 1)
        XCTAssertNotNil(model.lastCTID)
        XCTAssertEqual(model.history.first?.ctid, model.lastCTID?.signature)

        model.revokeConsent()
        XCTAssertEqual(model.consentState, .revoked)
        model.runSession()  // blocked

        XCTAssertEqual(model.history.count, 1)
        XCTAssertEqual(model.auditEvents.map(\.eventType),
                       ["consent_granted", "session_run", "consent_revoked", "session_blocked"])
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

final class ConsentStateMachineTests: XCTestCase {
    func testValidTransitions() {
        XCTAssertTrue(isValidConsentTransition(from: .pending, to: .granted))
        XCTAssertTrue(isValidConsentTransition(from: .pending, to: .revoked))
        XCTAssertTrue(isValidConsentTransition(from: .granted, to: .revoked))
        XCTAssertTrue(isValidConsentTransition(from: .granted, to: .expired))
    }

    func testInvalidTransitions() {
        XCTAssertFalse(isValidConsentTransition(from: .pending, to: .expired))
        XCTAssertFalse(isValidConsentTransition(from: .revoked, to: .granted))
        XCTAssertFalse(isValidConsentTransition(from: .expired, to: .granted))
        XCTAssertFalse(isValidConsentTransition(from: .granted, to: .pending))
    }

    func testMachineRejectsInvalidTransition() {
        let machine = ConsentStateMachine()
        XCTAssertTrue(machine.transition(to: .granted))
        XCTAssertFalse(machine.transition(to: .pending))
        XCTAssertEqual(machine.state, .granted)
    }
}

final class AuditLoggerTests: XCTestCase {
    func testAppendOnlyOrdering() {
        let logger = AuditLogger()
        logger.log(eventType: "a", userId: "u")
        logger.log(eventType: "b", userId: "u", data: ["k": "v"])
        XCTAssertEqual(logger.events.map(\.eventType), ["a", "b"])
        XCTAssertEqual(logger.events.last?.data, ["k": "v"])
    }
}

final class CTIDServiceTests: XCTestCase {
    private let metadata = ConsentTransactionID.Metadata(
        platform: "mobile", consentMethod: "explicit", geographicRegion: "unknown", kid: nil)

    func testGenerateProducesVerifiableCTID() throws {
        let service = CTIDService(secret: "test-secret")
        let ctid = try service.generate(userId: "user-1", dataTiers: [1, 2], metadata: metadata)

        XCTAssertEqual(ctid.version, "1.2")
        XCTAssertEqual(ctid.signature.count, 64)
        XCTAssertEqual(ctid.sessionId.count, 24)
        XCTAssertTrue(service.verify(ctid))
    }

    func testTamperedCTIDFailsVerification() throws {
        let service = CTIDService(secret: "test-secret")
        let ctid = try service.generate(userId: "user-1", dataTiers: [1], metadata: metadata)
        let tampered = ConsentTransactionID(
            version: ctid.version, userId: "attacker", sessionId: ctid.sessionId,
            timestamp: ctid.timestamp, dataTiers: ctid.dataTiers, expiry: ctid.expiry,
            parentCtid: ctid.parentCtid, signature: ctid.signature, metadata: ctid.metadata)
        XCTAssertFalse(service.verify(tampered))
    }

    func testWrongSecretFailsVerification() throws {
        let ctid = try CTIDService(secret: "secret-a").generate(userId: "u", dataTiers: [1], metadata: metadata)
        XCTAssertFalse(CTIDService(secret: "secret-b").verify(ctid))
    }

    func testExpiredCTIDFailsVerification() throws {
        let service = CTIDService(secret: "test-secret")
        let ctid = try service.generate(userId: "u", dataTiers: [1], metadata: metadata, expiryDays: -1)
        XCTAssertFalse(service.verify(ctid))
    }

    func testMissingSecretThrows() {
        XCTAssertThrowsError(try CTIDService(secret: "").generate(userId: "u", dataTiers: [1], metadata: metadata))
    }
}

final class CanonicalJSONTests: XCTestCase {
    func testSortsKeysAndMatchesCompactForm() {
        let value = CanonicalJSON.Value.object([
            "b": .int(2),
            "a": .string("x"),
            "c": .array([.int(1), .int(2)]),
            "d": .null,
        ])
        XCTAssertEqual(CanonicalJSON.stringify(value), "{\"a\":\"x\",\"b\":2,\"c\":[1,2],\"d\":null}")
    }

    func testEscapesControlCharacters() {
        XCTAssertEqual(CanonicalJSON.stringify(.string("a\"b\n")), "\"a\\\"b\\n\"")
    }
}
