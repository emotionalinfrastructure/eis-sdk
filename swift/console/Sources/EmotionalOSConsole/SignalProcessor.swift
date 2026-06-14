import Foundation

class SignalProcessor {
    func generateSignals(count: Int) -> [Double] {
        (0..<count).map { _ in Double.random(in: -1...1) }
    }

    func average(of signals: [Double]) -> Double {
        guard !signals.isEmpty else { return 0.0 }
        return signals.reduce(0, +) / Double(signals.count)
    }
}
