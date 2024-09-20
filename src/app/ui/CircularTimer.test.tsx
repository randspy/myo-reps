import { render, screen } from '@testing-library/react';
import { CircularTimer } from './CircularTimer';

describe('CircularTimer', () => {
  it('renders the time correctly', () => {
    render(<CircularTimer time={30} />);
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('formats time with minutes and seconds', () => {
    render(<CircularTimer time={90} />);
    expect(screen.getByText('1:30')).toBeInTheDocument();
  });

  it('does not show progress ring when showProgressRing is false', () => {
    const { container } = render(
      <CircularTimer time={30} showProgressRing={false} />,
    );
    expect(container.querySelectorAll('circle')).toHaveLength(1);
  });

  it('shows progress ring when showProgressRing is true', () => {
    const { container } = render(
      <CircularTimer
        time={30}
        showProgressRing={true}
        startTimeForAnimation={60}
      />,
    );
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('calculates stroke dash offset correctly', () => {
    const { container } = render(
      <CircularTimer
        time={30}
        showProgressRing={true}
        startTimeForAnimation={60}
      />,
    );
    const progressRing = container.querySelectorAll('circle')[1];

    expect(
      parseFloat(progressRing.getAttribute('stroke-dasharray')!),
    ).toBeCloseTo(282.74, 2);
    expect(
      parseFloat(progressRing.getAttribute('stroke-dashoffset')!),
    ).toBeCloseTo(141.37, 2);
  });

  it('does not calculate stroke dash offset when startTimeForAnimation is not provided', () => {
    const { container } = render(
      <CircularTimer time={30} showProgressRing={true} />,
    );

    const progressRing = container.querySelectorAll('circle')[1];

    expect(parseFloat(progressRing.getAttribute('stroke-dashoffset')!)).toBe(0);
  });
});
