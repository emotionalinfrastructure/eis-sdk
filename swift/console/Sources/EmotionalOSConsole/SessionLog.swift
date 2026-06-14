import Foundation

struct SessionRecord: Codable {
    let timestamp: Date
    let tone: String
    let average: Double
    let coherence: Double
    let trend: String
}

class SessionLog {
    var sessions: [SessionRecord] = []

    func recordSession(tone: String, avg: Double, coherence: Double, trend: String) {
        let record = SessionRecord(timestamp: Date(), tone: tone, average: avg, coherence: coherence, trend: trend)
        sessions.append(record)
    }

    func summary() {
        print("\n🗓 EmotionalOS Session Log Summary")
        guard !sessions.isEmpty else {
            print("No sessions recorded yet.")
            return
        }

        let grouped = Dictionary(grouping: sessions, by: { $0.tone })
        for (tone, list) in grouped {
            let avgCoherence = list.map { $0.coherence }.reduce(0, +) / Double(list.count)
            print("• \(tone): \(list.count) sessions | Avg Coherence: \(String(format: "%.2f", avgCoherence))")
        }
        print("—————————————————————————————\n")
    }
}
