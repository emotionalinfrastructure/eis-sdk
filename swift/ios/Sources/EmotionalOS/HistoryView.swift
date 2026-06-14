import SwiftUI

/// Chronological list of recorded sessions, most recent first.
struct HistoryView: View {
    @EnvironmentObject private var model: SessionViewModel

    var body: some View {
        NavigationStack {
            Group {
                if model.history.isEmpty {
                    ContentUnavailableView(
                        "No Sessions Yet",
                        systemImage: "clock",
                        description: Text("Run a session to start building history.")
                    )
                } else {
                    List(model.history.reversed()) { record in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(record.tone).font(.headline)
                            Text(record.timestamp, style: .time)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            Text("Coherence \(record.coherence, format: .number.precision(.fractionLength(2))) · \(record.trend)")
                                .font(.subheadline)
                        }
                    }
                }
            }
            .navigationTitle("History")
        }
    }
}
