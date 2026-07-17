import Foundation

/// Consent lifecycle states, mirroring the EIS SDK `ConsentState` enum.
enum ConsentState: String, Codable, CaseIterable, Equatable {
    case pending
    case granted
    case revoked
    case expired
}

/// Whether a consent state transition is permitted.
///
/// Mirrors the SDK's `VALID_TRANSITIONS` table: consent may be granted or
/// revoked from `pending`; revoked or expired from `granted`; and `revoked`
/// and `expired` are terminal.
func isValidConsentTransition(from: ConsentState, to: ConsentState) -> Bool {
    switch from {
    case .pending: return to == .granted || to == .revoked
    case .granted: return to == .revoked || to == .expired
    case .revoked, .expired: return false
    }
}

/// Tracks a single consent record's state, rejecting invalid transitions.
final class ConsentStateMachine {
    private(set) var state: ConsentState

    init(initialState: ConsentState = .pending) {
        state = initialState
    }

    /// Attempts a transition, returning `true` only when it is valid.
    @discardableResult
    func transition(to target: ConsentState) -> Bool {
        guard isValidConsentTransition(from: state, to: target) else { return false }
        state = target
        return true
    }
}
