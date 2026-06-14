import SwiftUI

/// Append-only, on-device record of sealed session summaries.
struct VaultView: View {
    @EnvironmentObject private var model: SessionViewModel

    var body: some View {
        NavigationStack {
            Group {
                if model.vaultEntries.isEmpty {
                    ContentUnavailableView(
                        "Vault Empty",
                        systemImage: "lock.shield",
                        description: Text("Sealed session records will appear here.")
                    )
                } else {
                    List(Array(model.vaultEntries.enumerated()), id: \.offset) { _, entry in
                        Label(entry, systemImage: "checkmark.seal")
                    }
                }
            }
            .navigationTitle("Vault")
        }
    }
}
