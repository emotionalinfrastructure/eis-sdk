import Foundation

/// Snapshot of session state persisted across app launches.
struct SessionStoreState: Codable, Equatable {
    var history: [SessionRecord] = []
    var vaultEntries: [String] = []
}

/// Persists session history and vault entries to disk.
protocol SessionStore {
    func load() -> SessionStoreState
    func save(_ state: SessionStoreState)
}

/// JSON file-backed session store, rooted in the app's Application Support directory.
final class FileSessionStore: SessionStore {
    private let fileURL: URL

    init(fileURL: URL = FileSessionStore.defaultFileURL()) {
        self.fileURL = fileURL
    }

    func load() -> SessionStoreState {
        guard let data = try? Data(contentsOf: fileURL) else { return SessionStoreState() }
        return (try? JSONDecoder().decode(SessionStoreState.self, from: data)) ?? SessionStoreState()
    }

    func save(_ state: SessionStoreState) {
        guard let data = try? JSONEncoder().encode(state) else { return }
        try? data.write(to: fileURL, options: .atomic)
    }

    static func defaultFileURL() -> URL {
        let directory = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        try? FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        return directory.appendingPathComponent("sessions.json")
    }
}
