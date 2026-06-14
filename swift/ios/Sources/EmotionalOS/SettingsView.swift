import SwiftUI

/// Session configuration and on-device privacy posture.
struct SettingsView: View {
    @EnvironmentObject private var model: SessionViewModel

    var body: some View {
        NavigationStack {
            Form {
                Section("Session") {
                    Stepper("Samples per session: \(model.sampleCount)",
                            value: $model.sampleCount, in: 2...100)
                }
                Section("Privacy") {
                    Label("No tracking", systemImage: "hand.raised")
                    Label("No data collected", systemImage: "lock")
                    Text("EmotionalOS processes signals on-device only. See PrivacyInfo.xcprivacy.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Settings")
        }
    }
}
