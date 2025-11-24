/**
 * Consent lifecycle state machine
 * 
 * Manages valid state transitions for consent lifecycle.
 */

export enum ConsentState {
  PENDING = 'pending',
  GRANTED = 'granted',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

/**
 * Valid state transitions for consent lifecycle
 */
const VALID_TRANSITIONS: Record<ConsentState, ConsentState[]> = {
  [ConsentState.PENDING]: [ConsentState.GRANTED, ConsentState.REVOKED],
  [ConsentState.GRANTED]: [ConsentState.REVOKED, ConsentState.EXPIRED],
  [ConsentState.REVOKED]: [],
  [ConsentState.EXPIRED]: [],
};

/**
 * Validates a consent state transition
 * @param from Current state
 * @param to Target state
 * @returns True if transition is valid, false otherwise
 */
export function isValidTransition(from: ConsentState, to: ConsentState): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/**
 * Represents a consent record with state tracking
 */
export class ConsentStateMachine {
  private state: ConsentState;
  
  constructor(initialState: ConsentState = ConsentState.PENDING) {
    this.state = initialState;
  }
  
  getState(): ConsentState {
    return this.state;
  }
  
  transition(to: ConsentState): boolean {
    if (isValidTransition(this.state, to)) {
      this.state = to;
      return true;
    }
    return false;
  }
}
