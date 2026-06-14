import Foundation

class SessionExporterJSON {
    func exportJSON(_ sessions: [SessionRecord]) {
        guard !sessions.isEmpty else {
            print("⚠️ No sessions to export.")
            return
        }

        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601

        do {
            let jsonData = try encoder.encode(sessions)
            let filename = "EmotionalOS_Sessions_\(Int(Date().timeIntervalSince1970)).json"
            let fileURL = FileManager.default.temporaryDirectory.appendingPathComponent(filename)
            try jsonData.write(to: fileURL)
            print("✅ JSON export successful!")
            print("📁 Saved at: \(fileURL.path)")
        } catch {
            print("❌ Failed to export JSON: \(error.localizedDescription)")
        }
    }
}
