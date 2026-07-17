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
                Section("Consent") {
                    LabeledContent("State", value: model.consentState.rawValue.capitalized)
                    switch model.consentState {
                    case .pending:
                        Button("Grant Consent") { model.grantConsent() }
                    case .granted:
                        Button("Revoke Consent", role: .destructive) { model.revokeConsent() }
                    case .revoked, .expired:
                        Text("Consent is \(model.consentState.rawValue). Sessions are locked.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                    Text("Sessions run only while consent is granted. Each run mints a signed Consent Transaction ID (CTID v1.2).")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
                Section("Audit Trail") {
                    LabeledContent("Events recorded", value: "\(model.auditEvents.count)")
                    if let ctid = model.lastCTID {
                        LabeledContent("Last CTID", value: String(ctid.signature.prefix(12)) + "…")
                            .font(.footnote.monospaced())
                    }
                }
                Section("Signal Source") {
                    Label(model.signalSourceIsLive ? "Live device motion" : "Synthetic (no motion sensor)",
                          systemImage: model.signalSourceIsLive ? "sensor.tag.radiowave.forward" : "waveform.path")
                    Text(model.signalSourceIsLive
                         ? "Sessions are driven by your device's motion sensors."
                         : "No motion sensor available; sessions use synthetic signals.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
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
