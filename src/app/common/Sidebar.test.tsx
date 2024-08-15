import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { routePaths } from '../routes';

describe('Sidebar', () => {
  const path = '/workouts';

  it('renders the sidebar with correct tabs', () => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Sidebar tabs={routePaths} path={path} close={() => true} />
      </MemoryRouter>,
    );

    const tabElements = screen.getAllByRole('link');
    expect(tabElements).toHaveLength(Object.keys(routePaths).length);

    expect(tabElements[0]).toHaveTextContent('Workouts');
    expect(tabElements[0].childNodes[0]).toHaveClass(
      'bg-primary text-primary-foreground',
    );

    expect(tabElements[1]).toHaveTextContent('Exercises');
    expect(tabElements[1].childNodes[0]).not.toHaveClass(
      'bg-primary text-primary-foreground',
    );
    expect(tabElements[2]).toHaveTextContent('Sessions');
    expect(tabElements[2].childNodes[0]).not.toHaveClass(
      'bg-primary text-primary-foreground',
    );
  });

  test('clicking on a tab calls the close function', () => {
    const close = vi.fn();

    render(
      <MemoryRouter initialEntries={[path]}>
        <Sidebar tabs={routePaths} path={path} close={close} />
      </MemoryRouter>,
    );

    const tabElements = screen.getAllByRole('link');
    act(() => {
      tabElements[1].click();
    });

    expect(close).toHaveBeenCalled();
  });
});
