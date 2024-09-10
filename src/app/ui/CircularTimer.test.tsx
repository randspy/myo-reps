import { act, render, screen, waitFor } from '@testing-library/react';
import { CircularTimer } from './CircularTimer';

describe('Circular Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders with initial time', () => {
    render(<CircularTimer initialTime={59} />);
    expect(screen.getByText('59')).toBeInTheDocument();
  });

  test('counts down when active', async () => {
    render(<CircularTimer initialTime={10} isActive={true} />);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(screen.getByText('9')).toBeInTheDocument();
    });
  });

  test('calls onTimeUp when time is up', async () => {
    const onTimeUp = vi.fn();
    render(
      <CircularTimer initialTime={1} isActive={true} onTimeUp={onTimeUp} />,
    );

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    await waitFor(() => {
      expect(onTimeUp).toHaveBeenCalled();
    });
  });

  test('counts up when isCountingUp is true', async () => {
    render(
      <CircularTimer initialTime={0} isActive={true} isCountingUp={true} />,
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  test('resets time when initialTime changes', () => {
    const { rerender } = render(<CircularTimer initialTime={30} />);

    rerender(<CircularTimer initialTime={60} />);
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  test('displays minutes when time is greater than 60', () => {
    render(<CircularTimer initialTime={120} />);
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });

  test('when counting down stop at 0', async () => {
    render(<CircularTimer initialTime={2} isActive={true} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
