import Foundation

/// Generates and summarizes biosignal samples.
///
/// Ported from the EmotionalOS console prototype so the iOS app and the
/// reference kernel share identical, test-covered behavior.
struct SignalProcessor {
    /// Produces `count` random samples in the closed range `-1...1`.
    func generateSignals(count: Int) -> [Double] {
        (0..<max(0, count)).map { _ in Double.random(in: -1...1) }
    }

    /// Arithmetic mean of the samples, or `0` when empty.
    func average(of signals: [Double]) -> Double {
        guard !signals.isEmpty else { return 0.0 }
        return signals.reduce(0, +) / Double(signals.count)
    }
}
