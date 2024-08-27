import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MainLayout } from '@/app/layout/MainLayout';
import { MemoryRouter } from 'react-router-dom';

describe('MainLayout', () => {
  test('MainLayout renders the correct header content', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={['/workouts']}>
        <MainLayout />
      </MemoryRouter>,
    );

    const headerElement = wrapper.getByTestId('header');
    expect(headerElement).toHaveTextContent('Workouts');
  });
});
