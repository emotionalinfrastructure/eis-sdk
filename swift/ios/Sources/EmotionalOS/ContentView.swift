import SwiftUI

/// Root tab shell tying the EmotionalOS screens together.
struct ContentView: View {
    var body: some View {
        TabView {
            WaveformView()
                .tabItem { Label("Session", systemImage: "waveform") }
            HistoryView()
                .tabItem { Label("History", systemImage: "clock") }
            AnalyticsView()
                .tabItem { Label("Analytics", systemImage: "chart.bar") }
            VaultView()
                .tabItem { Label("Vault", systemImage: "lock.shield") }
            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape") }
        }
    }
}
