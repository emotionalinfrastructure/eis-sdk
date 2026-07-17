import Foundation

/// A single append-only audit record, mirroring the SDK's `AuditEvent`.
struct AuditEvent: Codable, Equatable {
    let timestamp: Date
    let eventType: String
    let userId: String
    let data: [String: String]
}

/// Append-only, in-memory audit trail.
///
/// Mirrors the SDK's `AuditLogger`: events can only be appended and read back,
/// never mutated or removed.
final class AuditLogger {
    private var storage: [AuditEvent] = []
    private let clock: () -> Date

    init(clock: @escaping () -> Date = { Date() }) {
        self.clock = clock
    }

    /// Immutable view of the recorded events.
    var events: [AuditEvent] { storage }

    /// Appends an event, stamping it with the current time.
    func log(eventType: String, userId: String, data: [String: String] = [:]) {
        storage.append(AuditEvent(timestamp: clock(), eventType: eventType, userId: userId, data: data))
    }
}
