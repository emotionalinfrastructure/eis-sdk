import Foundation

/// Maps an average signal value onto a human-readable emotional tone.
struct ToneManager {
    func interpretTone(from average: Double) -> String {
        switch average {
        case ..<(-0.3): return "Calm / Grounded"
        case -0.3...0.3: return "Balanced"
        default: return "Elevated / Energized"
        }
    }
}
