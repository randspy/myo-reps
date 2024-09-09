import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '@/app/layout/Header';
import { SidebarProps } from '@/app/layout/Sidebar';

vi.mock('@/components/ui/mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle">Mock Mode Toggle</div>,
}));

const sidebarMock = vi.fn();
vi.mock('@/app/layout/Sidebar', () => ({
  Sidebar: (props: SidebarProps) => {
    sidebarMock(props);
    return (
      <div data-testid="sidebar-mock" onClick={props.close}>
        Mock Sidebar
      </div>
    );
  },
}));

describe('Header', () => {
  test('renders the header component', () => {
    render(
      <MemoryRouter initialEntries={['/workouts']}>
        <Header />
      </MemoryRouter>,
    );
    const headerElement = screen.getByTestId('header');
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the correct route name', () => {
    render(
      <MemoryRouter initialEntries={['/workouts']}>
        <Header />
      </MemoryRouter>,
    );

    const routeNameElement = screen.getByRole('heading', { name: 'Workouts' });
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

  test('renders clear app state component', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const clearAppStateElement = screen.getByRole('button', {
      name: "Delete app's state",
    });
    expect(clearAppStateElement).toBeInTheDocument();
  });

  test('App renders the correct sidebar content', () => {
    render(
      <MemoryRouter initialEntries={['/workouts']}>
        <Header />
      </MemoryRouter>,
    );

    expect(sidebarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        close: expect.any(Function),
        path: '/workouts',
        tabs: expect.arrayContaining([
          expect.objectContaining({
            title: 'Exercises',
          }),
          expect.objectContaining({
            title: 'Sessions',
          }),
          expect.objectContaining({
            title: 'Workouts',
          }),
        ]),
      }),
    );
  });

  test('opening of the sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/workouts']}>
        <Header />
      </MemoryRouter>,
    );

    const menuButton = screen.getByTestId('sidebar-toggle');

    act(() => {
      menuButton.click();
    });

    const sidebarElementParent = screen.getByTestId('sidebar-mock').parentNode;
    expect(sidebarElementParent).toHaveClass('translate-x-0');
  });

  test('closing of the sidebar by clicking outside', () => {
    render(
      <MemoryRouter initialEntries={['/workouts']}>
        <Header />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('sidebar-toggle'));

    const sidebarElementParent = screen.getByTestId('sidebar-mock').parentNode;

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
    });

    expect(sidebarElementParent).not.toHaveClass('translate-x-0');
  });

  test('closing on selecting route', () => {
    render(
      <MemoryRouter initialEntries={['/workouts']}>
        <Header />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('sidebar-toggle'));

    const sidebarElement = screen.getByTestId('sidebar-mock');

    fireEvent.click(sidebarElement);

    expect(sidebarElement.parentNode).not.toHaveClass('translate-x-0');
  });
});
