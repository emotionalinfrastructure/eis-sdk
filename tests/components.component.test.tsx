/**
 * Tests for Cognitive Stability System components.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { CognitiveStabilitySystem } from '../src/components/CognitiveStabilitySystem';
import { SaturationInputPanel } from '../src/components/SaturationInputPanel';
import { CognitionPanel } from '../src/components/CognitionPanel';
import { EmotionPanel } from '../src/components/EmotionPanel';
import { CoupledStateLock } from '../src/components/CoupledStateLock';
import { SystemStateSummary } from '../src/components/SystemStateSummary';
import { FrameworkNotes } from '../src/components/FrameworkNotes';
import { EventLog } from '../src/components/EventLog';

describe('SaturationInputPanel', () => {
  it('renders slider with correct value', () => {
    const handleChange = jest.fn();
    render(
      <SaturationInputPanel saturation={50} onSaturationChange={handleChange} />
    );
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('50');
  });

  it('calls onSaturationChange when slider changes', () => {
    const handleChange = jest.fn();
    render(
      <SaturationInputPanel saturation={50} onSaturationChange={handleChange} />
    );
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });
    expect(handleChange).toHaveBeenCalledWith(75);
  });

  it('increments saturation when +5 button is clicked', () => {
    const handleChange = jest.fn();
    render(
      <SaturationInputPanel saturation={50} onSaturationChange={handleChange} />
    );
    
    const incrementBtn = screen.getByLabelText('Increase saturation by 5');
    fireEvent.click(incrementBtn);
    expect(handleChange).toHaveBeenCalledWith(55);
  });

  it('decrements saturation when -5 button is clicked', () => {
    const handleChange = jest.fn();
    render(
      <SaturationInputPanel saturation={50} onSaturationChange={handleChange} />
    );
    
    const decrementBtn = screen.getByLabelText('Decrease saturation by 5');
    fireEvent.click(decrementBtn);
    expect(handleChange).toHaveBeenCalledWith(45);
  });

  it('clamps increment at max 100', () => {
    const handleChange = jest.fn();
    render(
      <SaturationInputPanel saturation={98} onSaturationChange={handleChange} />
    );
    
    const incrementBtn = screen.getByLabelText('Increase saturation by 5');
    fireEvent.click(incrementBtn);
    expect(handleChange).toHaveBeenCalledWith(100);
  });

  it('clamps decrement at min 0', () => {
    const handleChange = jest.fn();
    render(
      <SaturationInputPanel saturation={3} onSaturationChange={handleChange} />
    );
    
    const decrementBtn = screen.getByLabelText('Decrease saturation by 5');
    fireEvent.click(decrementBtn);
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it('disables increment button at max value', () => {
    const handleChange = jest.fn();
    render(
      <SaturationInputPanel saturation={100} onSaturationChange={handleChange} />
    );
    
    const incrementBtn = screen.getByLabelText('Increase saturation by 5');
    expect(incrementBtn).toBeDisabled();
  });

  it('disables decrement button at min value', () => {
    const handleChange = jest.fn();
    render(
      <SaturationInputPanel saturation={0} onSaturationChange={handleChange} />
    );
    
    const decrementBtn = screen.getByLabelText('Decrease saturation by 5');
    expect(decrementBtn).toBeDisabled();
  });

  it('displays output value', () => {
    const handleChange = jest.fn();
    render(
      <SaturationInputPanel saturation={75} onSaturationChange={handleChange} />
    );
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});

describe('CognitionPanel', () => {
  it('displays integrity value and label', () => {
    render(<CognitionPanel integrity={{ erg: 85, coc: 85 }} />);
    
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText(/Optimal/)).toBeInTheDocument();
  });

  it('shows Severely Impaired for low integrity', () => {
    render(<CognitionPanel integrity={{ erg: 10, coc: 10 }} />);
    
    expect(screen.getByText(/Severely Impaired/)).toBeInTheDocument();
  });

  it('shows Critically Low for integrity 20-39', () => {
    render(<CognitionPanel integrity={{ erg: 30, coc: 30 }} />);
    
    expect(screen.getByText(/Critically Low/)).toBeInTheDocument();
  });

  it('shows Moderately Reduced for integrity 40-59', () => {
    render(<CognitionPanel integrity={{ erg: 50, coc: 50 }} />);
    
    expect(screen.getByText(/Moderately Reduced/)).toBeInTheDocument();
  });

  it('shows Slightly Reduced for integrity 60-79', () => {
    render(<CognitionPanel integrity={{ erg: 70, coc: 70 }} />);
    
    expect(screen.getByText(/Slightly Reduced/)).toBeInTheDocument();
  });
});

describe('EmotionPanel', () => {
  it('displays integrity value and label', () => {
    render(<EmotionPanel integrity={{ erg: 85, coc: 85 }} />);
    
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText(/Optimal/)).toBeInTheDocument();
  });

  it('shows Severely Impaired for low integrity', () => {
    render(<EmotionPanel integrity={{ erg: 10, coc: 10 }} />);
    
    expect(screen.getByText(/Severely Impaired/)).toBeInTheDocument();
  });

  it('shows Critically Low for integrity 20-39', () => {
    render(<EmotionPanel integrity={{ erg: 30, coc: 30 }} />);
    
    expect(screen.getByText(/Critically Low/)).toBeInTheDocument();
  });

  it('shows Moderately Reduced for integrity 40-59', () => {
    render(<EmotionPanel integrity={{ erg: 50, coc: 50 }} />);
    
    expect(screen.getByText(/Moderately Reduced/)).toBeInTheDocument();
  });

  it('shows Slightly Reduced for integrity 60-79', () => {
    render(<EmotionPanel integrity={{ erg: 70, coc: 70 }} />);
    
    expect(screen.getByText(/Slightly Reduced/)).toBeInTheDocument();
  });
});

describe('CoupledStateLock', () => {
  it('displays Coupled when isCoupled is true', () => {
    render(<CoupledStateLock isCoupled={true} />);
    
    expect(screen.getByText('Coupled')).toBeInTheDocument();
    expect(screen.getByText('Cognitive and emotional systems are operating in sync')).toBeInTheDocument();
  });

  it('displays Uncoupled when isCoupled is false', () => {
    render(<CoupledStateLock isCoupled={false} />);
    
    expect(screen.getByText('Uncoupled')).toBeInTheDocument();
    expect(screen.getByText('Cognitive and emotional systems are fragmented')).toBeInTheDocument();
  });
});

describe('SystemStateSummary', () => {
  it('displays stable state', () => {
    render(<SystemStateSummary state="stable" />);
    
    expect(screen.getByText('Stable')).toBeInTheDocument();
    expect(screen.getByText(/Optimal functioning/)).toBeInTheDocument();
  });

  it('displays narrowed state', () => {
    render(<SystemStateSummary state="narrowed" />);
    
    expect(screen.getByText('Narrowed')).toBeInTheDocument();
    expect(screen.getByText(/Reduced capacity/)).toBeInTheDocument();
  });

  it('displays critical state', () => {
    render(<SystemStateSummary state="critical" />);
    
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText(/Significant impairment/)).toBeInTheDocument();
  });

  it('displays fractured state', () => {
    render(<SystemStateSummary state="fractured" />);
    
    expect(screen.getByText('Fractured')).toBeInTheDocument();
    expect(screen.getByText(/Severe impairment/)).toBeInTheDocument();
  });
});

describe('FrameworkNotes', () => {
  it('displays framework information', () => {
    render(<FrameworkNotes />);
    
    expect(screen.getByText('Framework Notes')).toBeInTheDocument();
    expect(screen.getByText(/Emotional Infrastructure/)).toBeInTheDocument();
    expect(screen.getByText(/Protected Invariants/)).toBeInTheDocument();
  });
});

describe('EventLog', () => {
  it('displays empty state when no events', () => {
    render(<EventLog events={[]} />);
    
    expect(screen.getByText('Event Log')).toBeInTheDocument();
    expect(screen.getByText('No events recorded yet')).toBeInTheDocument();
  });

  it('displays events when provided', () => {
    render(<EventLog events={['10:30:15 - State: stable', '10:30:10 - State: narrowed']} />);
    
    expect(screen.getByText('10:30:15 - State: stable')).toBeInTheDocument();
    expect(screen.getByText('10:30:10 - State: narrowed')).toBeInTheDocument();
  });
});

describe('CognitiveStabilitySystem', () => {
  it('renders with default props', () => {
    render(<CognitiveStabilitySystem />);
    
    expect(screen.getByText('Cognitive Stability System')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveValue('50');
  });

  it('uses initialSaturation prop', () => {
    render(<CognitiveStabilitySystem initialSaturation={30} />);
    
    expect(screen.getByRole('slider')).toHaveValue('30');
  });

  it('clamps initialSaturation to valid range', () => {
    render(<CognitiveStabilitySystem initialSaturation={150} />);
    
    expect(screen.getByRole('slider')).toHaveValue('100');
  });

  it('clamps negative initialSaturation to valid range', () => {
    render(<CognitiveStabilitySystem initialSaturation={-50} />);
    
    expect(screen.getByRole('slider')).toHaveValue('0');
  });

  it('does not show event log by default', () => {
    render(<CognitiveStabilitySystem />);
    
    expect(screen.queryByText('Event Log')).not.toBeInTheDocument();
  });

  it('shows event log when enableEventLog is true', () => {
    render(<CognitiveStabilitySystem enableEventLog={true} />);
    
    expect(screen.getByText('Event Log')).toBeInTheDocument();
  });

  it('updates when saturation changes', () => {
    render(<CognitiveStabilitySystem initialSaturation={50} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '20' } });
    
    expect(slider).toHaveValue('20');
    // Verify the system state region shows "Stable"
    const systemStateSection = screen.getByRole('status', { name: /System state/i });
    expect(systemStateSection).toHaveTextContent('Stable');
  });

  it('records events when enableEventLog is true and state changes', () => {
    render(<CognitiveStabilitySystem initialSaturation={50} enableEventLog={true} />);
    
    // Initial state is 'narrowed' (50% saturation = 50% integrity)
    expect(screen.getByText('No events recorded yet')).toBeInTheDocument();
    
    // Change saturation to trigger state change to 'stable'
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '15' } });
    
    // Now the event log should have recorded the state change
    expect(screen.queryByText('No events recorded yet')).not.toBeInTheDocument();
    // The event should contain the new state
    const eventLog = screen.getByRole('log');
    expect(eventLog).toHaveTextContent(/State: stable/);
    expect(eventLog).toHaveTextContent(/coupled/);
  });

  it('records events with uncoupled state when integrity drops below threshold', () => {
    render(<CognitiveStabilitySystem initialSaturation={50} enableEventLog={true} />);
    
    // Change saturation to 85 (integrity = 15, below coupling threshold of 20)
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '85' } });
    
    // The event log should show uncoupled and fractured state
    const eventLog = screen.getByRole('log');
    expect(eventLog).toHaveTextContent(/uncoupled/);
    expect(eventLog).toHaveTextContent(/State: fractured/);
  });
});
