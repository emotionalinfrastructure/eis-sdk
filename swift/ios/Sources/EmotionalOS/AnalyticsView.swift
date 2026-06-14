import SwiftUI

/// Latest-session readouts plus simple aggregates across all sessions.
struct AnalyticsView: View {
    @EnvironmentObject private var model: SessionViewModel

    var body: some View {
        NavigationStack {
            Form {
                Section("Latest") {
                    LabeledContent("Tone") { Text(model.tone) }
                    LabeledContent("Average") {
                        Text(model.average, format: .number.precision(.fractionLength(2)))
                    }
                    LabeledContent("Coherence") {
                        Text(model.coherence, format: .number.precision(.fractionLength(2)))
                    }
                    LabeledContent("Trend") { Text(model.trend) }
                }
                Section("Aggregate") {
                    LabeledContent("Sessions") { Text("\(model.history.count)") }
                    LabeledContent("Avg Coherence") {
                        Text(model.averageCoherence, format: .number.precision(.fractionLength(2)))
                    }
                }
            }
            .navigationTitle("Analytics")
        }
    }
}
