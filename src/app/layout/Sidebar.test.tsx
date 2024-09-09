import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { sideBarRoutePaths } from '@/app/routes';

describe('Sidebar', () => {
  const path = '/workouts';

  test('renders the sidebar with correct tabs', () => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Sidebar tabs={sideBarRoutePaths} path={path} close={() => true} />
      </MemoryRouter>,
    );

    const tabElements = screen.getAllByRole('link');
    expect(tabElements).toHaveLength(Object.keys(sideBarRoutePaths).length);

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

  test('renders the sidebar with the correct active tab', () => {
    render(
      <MemoryRouter initialEntries={['/exercises']}>
        <Sidebar
          tabs={sideBarRoutePaths}
          path="/exercises/new"
          close={() => true}
        />
      </MemoryRouter>,
    );

    const tabElements = screen.getAllByRole('link');
    expect(tabElements[1].childNodes[0]).toHaveClass(
      'bg-primary text-primary-foreground',
    );
  });

  test('clicking on a tab calls the close function', () => {
    const close = vi.fn();

    render(
      <MemoryRouter initialEntries={[path]}>
        <Sidebar tabs={sideBarRoutePaths} path={path} close={close} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole('link')[1]);

    expect(close).toHaveBeenCalled();
  });
});
