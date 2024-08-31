import { fireEvent, screen } from '@testing-library/react';
import { ExercisesPage } from '@/app/features/exercises/ExercisesPage';
import { generateExercise, renderWithProviders } from '@/lib/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

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
    renderWithProviders(
      <MemoryRouter initialEntries={['/exercises']}>
        <ExercisesPage />
      </MemoryRouter>,
      {
        preloadedState: initialState,
      },
    );

    initialState.exercises.values.forEach((exercise) => {
      const exerciseElement = screen.getByText(exercise.name);

      expect(exerciseElement).toBeInTheDocument();
    });
  });

  test('renders ExerciseList component', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/exercises']}>
        <ExercisesPage />
      </MemoryRouter>,
      {
        preloadedState: initialState,
      },
    );

    initialState.exercises.values.forEach((exercise) => {
      const exerciseElement = screen.getByText(exercise.name);

      expect(exerciseElement).toBeInTheDocument();
    });
  });

  test('that it centers the add button when no exercises present', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/exercises']}>
        <ExercisesPage />
      </MemoryRouter>,
    );

    const container = screen.getByTestId('exercises-page-container');
    expect(container).toHaveClass('justify-center');
  });

  test("that it doesn't centers the add button when there are exercises present", () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/exercises']}>
        <ExercisesPage />
      </MemoryRouter>,
      {
        preloadedState: initialState,
      },
    );

    const container = screen.getByTestId('exercises-page-container');
    expect(container).not.toHaveClass('justify-center');
  });

  test('renders the add new exercise button', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/exercises']}>
        <ExercisesPage />
      </MemoryRouter>,
    );

    const addExerciseButton = screen.getByRole('button', {
      name: 'Add New Exercise',
    });

    expect(addExerciseButton).toBeInTheDocument();
  });

  test('navigates to the new exercise page when the add new exercise button is clicked', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/exercises']}>
        <Routes>
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/new" element={<div>New Exercise Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const addExerciseButton = screen.getByRole('button', {
      name: 'Add New Exercise',
    });

    fireEvent.click(addExerciseButton);

    expect(screen.getByText('New Exercise Page')).toBeInTheDocument();
  });
});
