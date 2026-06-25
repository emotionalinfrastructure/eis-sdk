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

@MainActor
final class SessionViewModelTests: XCTestCase {
    func testRunSessionPopulatesState() {
        let model = SessionViewModel()
        model.runSession()

        XCTAssertEqual(model.signals.count, model.sampleCount)
        XCTAssertEqual(model.history.count, 1)
        XCTAssertEqual(model.vaultEntries.count, 1)
        XCTAssertFalse(model.tone.isEmpty)
    }

    func testAverageCoherenceAcrossSessions() {
        let model = SessionViewModel()
        model.runSession()
        model.runSession()
        XCTAssertEqual(model.history.count, 2)
        XCTAssertGreaterThanOrEqual(model.averageCoherence, 0.0)
        XCTAssertLessThanOrEqual(model.averageCoherence, 1.0)
    }
}
