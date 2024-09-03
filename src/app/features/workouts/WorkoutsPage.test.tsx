import { fireEvent, screen } from '@testing-library/react';
import { WorkoutsPage } from '@/app/features/workouts/WorkoutsPage';
import { generateWorkout, renderWithProviders } from '@/lib/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const initialState = {
  workouts: {
    values: [
      generateWorkout({
        id: '1',
        position: 0,
        name: 'Upper body',
      }),
    ],
  },
};

describe('Workouts page', () => {
  describe('when there are workouts present', () => {
    beforeEach(() => {
      renderWithProviders(
        <MemoryRouter>
          <WorkoutsPage />
        </MemoryRouter>,
        {
          preloadedState: initialState,
        },
      );
    });

    test('renders workouts list component', () => {
      initialState.workouts.values.forEach((workouts) => {
        expect(screen.getByText(workouts.name)).toBeInTheDocument();
      });
    });

    test("that it doesn't centers the add button when there are workouts present", () => {
      expect(screen.getByTestId('workouts-page-container')).not.toHaveClass(
        'justify-center',
      );
    });
  });

  test('that it centers the add button when no workouts present', () => {
    renderWithProviders(
      <MemoryRouter>
        <WorkoutsPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('workouts-page-container')).toHaveClass(
      'justify-center',
    );
  });

  test('navigates to the new exercise page when the add new exercise button is clicked', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/workouts']}>
        <Routes>
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/new" element={<div>New Workout Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole('link', {
        name: 'Add New Workout',
      }),
    );

    expect(screen.getByText('New Workout Page')).toBeInTheDocument();
  });
});
