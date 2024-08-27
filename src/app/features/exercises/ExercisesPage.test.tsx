import { screen } from '@testing-library/react';
import { ExercisesPage } from '@/app/features/exercises/ExercisesPage';
import { generateExercise, renderWithProviders } from '@/lib/test-utils';

const initialState = {
  exercises: {
    values: [
      generateExercise({
        id: '1',
        position: 0,
        name: 'Push-up',
      }),
      generateExercise({
        id: '2',
        position: 1,
        name: 'Squat',
      }),
    ],
  },
};

describe('Exercise page', () => {
  test('renders ExerciseList component', () => {
    renderWithProviders(<ExercisesPage />, {
      preloadedState: initialState,
    });

    initialState.exercises.values.forEach((exercise) => {
      const exerciseElement = screen.getByText(exercise.name);

      expect(exerciseElement).toBeInTheDocument();
    });
  });

  test('renders ExerciseList component', () => {
    renderWithProviders(<ExercisesPage />, {
      preloadedState: initialState,
    });

    initialState.exercises.values.forEach((exercise) => {
      const exerciseElement = screen.getByText(exercise.name);

      expect(exerciseElement).toBeInTheDocument();
    });
  });

  test('that it centers the add button when no exercises present', () => {
    renderWithProviders(<ExercisesPage />);

    const container = screen.getByTestId('exercises-page-container');
    expect(container).toHaveClass('justify-center');
  });

  test("that it doesn't centers the add button when there are exercises present", () => {
    renderWithProviders(<ExercisesPage />, {
      preloadedState: initialState,
    });

    const container = screen.getByTestId('exercises-page-container');
    expect(container).not.toHaveClass('justify-center');
  });
});
