import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';
import { vi } from 'vitest';

vi.mock('@/components/mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle">Mock Mode Toggle</div>,
}));

describe('Header', () => {
  test('renders the header component', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const headerElement = screen.getByText('Myo Reps');
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the correct route name', () => {
    render(
      <MemoryRouter initialEntries={['/workouts']}>
        <Header />
      </MemoryRouter>,
    );

    const routeNameElement = screen.getByText('Workouts');
    expect(routeNameElement).toBeInTheDocument();
  });

  test('renders the mocked mode toggle component', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const modeToggleElement = screen.getByTestId('mode-toggle');
    expect(modeToggleElement).toBeInTheDocument();
    expect(modeToggleElement).toHaveTextContent('Mock Mode Toggle');
  });
});
