import Foundation

class Analytics {
    func coherence(of signals: [Double]) -> Double {
        guard !signals.isEmpty else { return 0 }
        let mean = signals.reduce(0, +) / Double(signals.count)
        let variance = signals.map { pow($0 - mean, 2) }.reduce(0, +) / Double(signals.count)
        let stdDev = sqrt(variance)
        return max(0, 1 - stdDev)
    }

    func trend(of signals: [Double]) -> String {
        guard signals.count > 1 else { return "Neutral" }
        let diff = signals.last! - signals.first!
        switch diff {
        case ..<(-0.2): return "Falling / Calming"
        case -0.2...0.2: return "Stable"
        default: return "Rising / Energizing"
        }
    }
}
