import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';
import { SidebarProps } from '@/app/Sidebar';

vi.mock('@/components/mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle">Mock Mode Toggle</div>,
}));

const sidebarMock = vi.fn();
vi.mock('@/app/Sidebar', () => ({
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
        tabs: expect.objectContaining({
          '/exercises': expect.objectContaining({
            title: 'Exercises',
          }),
          '/sessions': expect.objectContaining({
            title: 'Sessions',
          }),
          '/workouts': expect.objectContaining({
            title: 'Workouts',
          }),
        }),
      }),
    );
  });

  test('opening and closing of the sidebar', () => {
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

    const menuButton = screen.getByTestId('sidebar-toggle');

    act(() => {
      menuButton.click();
    });

    const sidebarElement = screen.getByTestId('sidebar-mock');

    act(() => {
      sidebarElement.click();
    });

    expect(sidebarElement.parentNode).not.toHaveClass('translate-x-0');
  });
});
