import Foundation

/// An immutable record of one analysis session.
struct SessionRecord: Identifiable, Codable, Equatable {
    var id = UUID()
    let timestamp: Date
    let tone: String
    let average: Double
    let coherence: Double
    let trend: String
}
