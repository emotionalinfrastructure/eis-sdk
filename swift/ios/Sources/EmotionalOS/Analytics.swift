import Foundation

/// Derives coherence (signal stability) and trend direction from a sample set.
struct Analytics {
    /// Coherence in `0...1`: `1` is perfectly stable, lower means more variance.
    func coherence(of signals: [Double]) -> Double {
        guard !signals.isEmpty else { return 0 }
        let mean = signals.reduce(0, +) / Double(signals.count)
        let variance = signals.map { pow($0 - mean, 2) }.reduce(0, +) / Double(signals.count)
        return max(0, 1 - sqrt(variance))
    }

    /// Direction of change between the first and last sample.
    func trend(of signals: [Double]) -> String {
        guard signals.count > 1, let first = signals.first, let last = signals.last else { return "Neutral" }
        switch last - first {
        case ..<(-0.2): return "Falling / Calming"
        case -0.2...0.2: return "Stable"
        default: return "Rising / Energizing"
        }
    }
}
