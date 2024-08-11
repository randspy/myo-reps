import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App } from './App';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

describe('App', () => {
  test('App renders the correct header content', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/workouts']}>
        <App />
      </MemoryRouter>,
    );

    const headerElement = wrapper.getByTestId('header');
    expect(headerElement).toHaveTextContent('Workouts');
  });

  test('App renders the correct sidebar content', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/workouts']}>
        <App />
      </MemoryRouter>,
    );

    const sidebarElement = wrapper.getByTestId('sidebar');
    expect(sidebarElement).toHaveTextContent('Workouts');
    expect(sidebarElement).toHaveTextContent('Exercises');
    expect(sidebarElement).toHaveTextContent('Sessions');
  });
});
