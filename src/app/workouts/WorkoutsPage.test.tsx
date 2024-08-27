import { screen } from '@testing-library/react';
import { WorkoutsPage } from '@/app/workouts/WorkoutsPage';
import { generateWorkout, renderWithProviders } from '@/lib/test-utils';

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
      renderWithProviders(<WorkoutsPage />, {
        preloadedState: initialState,
      });
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
    renderWithProviders(<WorkoutsPage />);

    expect(screen.getByTestId('workouts-page-container')).toHaveClass(
      'justify-center',
    );
  });
});
