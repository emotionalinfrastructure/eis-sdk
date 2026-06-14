import Foundation

class Vault {
    private var entries: [String] = []

    func store(_ message: String) {
        entries.append(message)
    }

    func listEntries() {
        print("🗝 Vault Contents:")
        for entry in entries {
            print("•", entry)
        }
    }
}
