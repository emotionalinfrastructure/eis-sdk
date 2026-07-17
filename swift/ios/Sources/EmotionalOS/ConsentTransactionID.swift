import Foundation
import CryptoKit

/// Consent Transaction ID, schema v1.2 — a faithful Swift port of the SDK's
/// `ConsentTransactionID`. Signed with HMAC-SHA256 over a canonical (sorted-key)
/// JSON encoding of every field except the signature itself, so a CTID minted
/// here can be verified by any peer sharing the same secret.
struct ConsentTransactionID: Codable, Equatable {
    let version: String
    let userId: String
    let sessionId: String
    let timestamp: String
    let dataTiers: [Int]
    let expiry: String
    let parentCtid: String?
    let signature: String
    let metadata: Metadata

    struct Metadata: Codable, Equatable {
        let platform: String          // "web" | "mobile" | "api"
        let consentMethod: String     // "explicit" | "implicit" | "deferred"
        let geographicRegion: String
        let kid: String?

        enum CodingKeys: String, CodingKey {
            case platform
            case consentMethod = "consent_method"
            case geographicRegion = "geographic_region"
            case kid
        }
    }

    enum CodingKeys: String, CodingKey {
        case version
        case userId = "user_id"
        case sessionId = "session_id"
        case timestamp
        case dataTiers = "data_tiers"
        case expiry
        case parentCtid = "parent_ctid"
        case signature
        case metadata
    }
}

/// Generates and verifies `ConsentTransactionID` values.
struct CTIDService {
    /// Development placeholder. Production builds MUST inject a real secret
    /// (e.g. provisioned by the backend or stored in the Secure Enclave) rather
    /// than shipping this constant.
    static let defaultSecret = "eis-dev-placeholder-secret"

    let secret: String

    enum CTIDError: Error { case missingSecret }

    /// Mints a signed CTID for the given user and data tiers.
    func generate(userId: String,
                  dataTiers: [Int],
                  metadata: ConsentTransactionID.Metadata,
                  parentCTID: String? = nil,
                  expiryDays: Int = 30,
                  now: Date = Date()) throws -> ConsentTransactionID {
        guard !secret.isEmpty else { throw CTIDError.missingSecret }

        let expiry = now.addingTimeInterval(Double(expiryDays) * 86_400)
        let unsigned = ConsentTransactionID(
            version: "1.2",
            userId: userId,
            sessionId: Self.generateSessionId(),
            timestamp: Self.iso(now),
            dataTiers: dataTiers,
            expiry: Self.iso(expiry),
            parentCtid: parentCTID,
            signature: "",
            metadata: metadata
        )

        let signature = Self.hmacHex(Self.canonicalString(for: unsigned), secret: secret)
        return ConsentTransactionID(
            version: unsigned.version,
            userId: unsigned.userId,
            sessionId: unsigned.sessionId,
            timestamp: unsigned.timestamp,
            dataTiers: unsigned.dataTiers,
            expiry: unsigned.expiry,
            parentCtid: unsigned.parentCtid,
            signature: signature,
            metadata: unsigned.metadata
        )
    }

    /// Verifies a CTID's signature and that it has not expired.
    func verify(_ ctid: ConsentTransactionID, now: Date = Date()) -> Bool {
        guard !secret.isEmpty else { return false }
        guard ctid.signature.count == 64 else { return false }
        guard let expiry = Self.parseISO(ctid.expiry) else { return false }
        guard expiry >= now else { return false }
        let expected = Self.hmacHex(Self.canonicalString(for: ctid), secret: secret)
        return Self.constantTimeEqual(expected, ctid.signature)
    }

    // MARK: - Canonicalization

    /// Canonical JSON of every field except the signature, matching the SDK's
    /// `canonicalStringify` (recursively sorted keys, compact separators).
    private static func canonicalString(for ctid: ConsentTransactionID) -> String {
        var metadata: [String: CanonicalJSON.Value] = [
            "platform": .string(ctid.metadata.platform),
            "consent_method": .string(ctid.metadata.consentMethod),
            "geographic_region": .string(ctid.metadata.geographicRegion),
        ]
        if let kid = ctid.metadata.kid {
            metadata["kid"] = .string(kid)
        }

        let payload: [String: CanonicalJSON.Value] = [
            "version": .string(ctid.version),
            "user_id": .string(ctid.userId),
            "session_id": .string(ctid.sessionId),
            "timestamp": .string(ctid.timestamp),
            "data_tiers": .array(ctid.dataTiers.map { .int($0) }),
            "expiry": .string(ctid.expiry),
            "parent_ctid": ctid.parentCtid.map { CanonicalJSON.Value.string($0) } ?? .null,
            "metadata": .object(metadata),
        ]
        return CanonicalJSON.stringify(.object(payload))
    }

    // MARK: - Crypto helpers

    private static func hmacHex(_ payload: String, secret: String) -> String {
        let key = SymmetricKey(data: Data(secret.utf8))
        let code = HMAC<SHA256>.authenticationCode(for: Data(payload.utf8), using: key)
        return code.map { String(format: "%02x", $0) }.joined()
    }

    private static func constantTimeEqual(_ a: String, _ b: String) -> Bool {
        let lhs = Array(a.utf8), rhs = Array(b.utf8)
        guard lhs.count == rhs.count else { return false }
        var diff: UInt8 = 0
        for i in 0..<lhs.count { diff |= lhs[i] ^ rhs[i] }
        return diff == 0
    }

    static func generateSessionId() -> String {
        var rng = SystemRandomNumberGenerator()
        return (0..<12).map { _ in String(format: "%02x", UInt8.random(in: 0...255, using: &rng)) }.joined()
    }

    // MARK: - Timestamps

    private static let isoFormatter: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()

    private static func iso(_ date: Date) -> String { isoFormatter.string(from: date) }

    private static func parseISO(_ string: String) -> Date? {
        if let date = isoFormatter.date(from: string) { return date }
        let fallback = ISO8601DateFormatter()
        fallback.formatOptions = [.withInternetDateTime]
        return fallback.date(from: string)
    }
}

/// Minimal canonical JSON serializer matching JS `JSON.stringify(sortKeys(obj))`:
/// object keys sorted lexicographically, compact separators, standard escaping.
enum CanonicalJSON {
    indirect enum Value {
        case string(String)
        case int(Int)
        case null
        case array([Value])
        case object([String: Value])
    }

    static func stringify(_ value: Value) -> String {
        switch value {
        case .null:
            return "null"
        case .int(let n):
            return String(n)
        case .string(let s):
            return escape(s)
        case .array(let items):
            return "[" + items.map(stringify).joined(separator: ",") + "]"
        case .object(let obj):
            let body = obj.keys.sorted()
                .map { key in escape(key) + ":" + stringify(obj[key]!) }
                .joined(separator: ",")
            return "{" + body + "}"
        }
    }

    private static func escape(_ string: String) -> String {
        var out = "\""
        for scalar in string.unicodeScalars {
            switch scalar {
            case "\"": out += "\\\""
            case "\\": out += "\\\\"
            case "\u{08}": out += "\\b"
            case "\u{0C}": out += "\\f"
            case "\n": out += "\\n"
            case "\r": out += "\\r"
            case "\t": out += "\\t"
            default:
                if scalar.value < 0x20 {
                    out += String(format: "\\u%04x", scalar.value)
                } else {
                    out.unicodeScalars.append(scalar)
                }
            }
        }
        out += "\""
        return out
    }
}
