import Foundation

class Report {
    func printSessionSummary(signals: [Double], avg: Double, tone: String, coherence: Double, trend: String) {
        let divider = String(repeating: "—", count: 45)
        print("\n\(divider)")
        print("🧠 EmotionalOS Session Summary")
        print("\(divider)")
        print("📡 Signals: \(signals.map { String(format: "%.2f", $0) }.joined(separator: ", "))")
        print("🔸 Average: \(String(format: "%.2f", avg))")
        print("🎚 Tone: \(tone)")
        print("📈 Coherence: \(String(format: "%.2f", coherence))")
        print("📊 Trend: \(trend)")
        print("\(divider)\n")
    }
}
