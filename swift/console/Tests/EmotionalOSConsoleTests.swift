import XCTest
@testable import EmotionalOSConsole

final class SignalProcessorTests: XCTestCase {
    func testAverageOfEmptySignals() {
        let processor = SignalProcessor()
        XCTAssertEqual(processor.average(of: []), 0.0)
    }

    func testAverageOfKnownValues() {
        let processor = SignalProcessor()
        XCTAssertEqual(processor.average(of: [0.5, -0.5, 1.0, -1.0]), 0.0, accuracy: 1e-10)
    }

    func testGenerateSignalsCount() {
        let processor = SignalProcessor()
        let signals = processor.generateSignals(count: 10)
        XCTAssertEqual(signals.count, 10)
        XCTAssertTrue(signals.allSatisfy { $0 >= -1.0 && $0 <= 1.0 })
    }
}

final class ToneManagerTests: XCTestCase {
    let tm = ToneManager()

    func testCalmTone() {
        XCTAssertEqual(tm.interpretTone(from: -0.5), "Calm / Grounded")
    }

    func testBalancedTone() {
        XCTAssertEqual(tm.interpretTone(from: 0.0), "Balanced")
    }

    func testElevatedTone() {
        XCTAssertEqual(tm.interpretTone(from: 0.8), "Elevated / Energized")
    }
}

final class AnalyticsTests: XCTestCase {
    let analytics = Analytics()

    func testCoherenceOfConstantSignals() {
        // Constant signal → zero variance → coherence of 1.0
        XCTAssertEqual(analytics.coherence(of: [0.5, 0.5, 0.5]), 1.0, accuracy: 1e-10)
    }

    func testCoherenceOfEmptySignals() {
        XCTAssertEqual(analytics.coherence(of: []), 0.0)
    }

    func testTrendFalling() {
        XCTAssertEqual(analytics.trend(of: [0.8, -0.8]), "Falling / Calming")
    }

    func testTrendRising() {
        XCTAssertEqual(analytics.trend(of: [-0.8, 0.8]), "Rising / Energizing")
    }

    func testTrendStable() {
        XCTAssertEqual(analytics.trend(of: [0.1, 0.15]), "Stable")
    }
}
