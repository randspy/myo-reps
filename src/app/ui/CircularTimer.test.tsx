import { render, screen, waitFor } from '@testing-library/react';
import { CircularTimer } from './CircularTimer';

describe('Circular Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with initial time', () => {
    render(<CircularTimer initialTime={59} />);
    expect(screen.getByText('59')).toBeInTheDocument();
  });

  it('counts down when active', async () => {
    render(<CircularTimer initialTime={10} isActive={true} />);
    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(screen.getByText('9')).toBeInTheDocument();
    });
  });

  it('calls onTimeUp when time is up', async () => {
    const onTimeUp = vi.fn();
    render(
      <CircularTimer initialTime={1} isActive={true} onTimeUp={onTimeUp} />,
    );
    vi.advanceTimersByTime(1500);
    await waitFor(() => {
      expect(onTimeUp).toHaveBeenCalled();
    });
  });

  it('counts up when isCountingUp is true', async () => {
    render(
      <CircularTimer initialTime={0} isActive={true} isCountingUp={true} />,
    );
    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('resets time when initialTime changes', () => {
    const { rerender } = render(<CircularTimer initialTime={30} />);

    rerender(<CircularTimer initialTime={60} />);
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('displays minutes when time is greater than 60', () => {
    render(<CircularTimer initialTime={120} />);
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });

  it('when counting down stop at 0', async () => {
    render(<CircularTimer initialTime={2} isActive={true} />);
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
