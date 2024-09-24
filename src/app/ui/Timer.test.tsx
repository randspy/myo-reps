import { render, screen } from '@testing-library/react';
import { Timer } from './Timer';

describe('Timer', () => {
  it('renders the time correctly', () => {
    render(<Timer time={30} />);
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  test('formats time with minutes and seconds', () => {
    render(<Timer time={90} />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  test('formats time with hours, minutes and seconds', () => {
    render(<Timer time={3711} />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('51')).toBeInTheDocument();
  });
});
