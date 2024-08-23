import { render, screen } from '@testing-library/react';
import { ExercisesPage } from '@/app/exercises/ExercisesPage';
import { Provider } from 'react-redux';
import { store as emptyStore } from '@/store/store';
import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from '@/features/exercises/exercises-slice';
import { generateExercise } from '@/lib/test-utils';

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

const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
  },
  preloadedState: initialState,
});

describe('Exercise page', () => {
  test('renders ExerciseList component', () => {
    render(
      <Provider store={store}>
        <ExercisesPage />
      </Provider>,
    );

    initialState.exercises.values.forEach((exercise) => {
      const exerciseElement = screen.getByText(exercise.name);

      expect(exerciseElement).toBeInTheDocument();
    });
  });

  test('renders ExerciseList component', () => {
    render(
      <Provider store={store}>
        <ExercisesPage />
      </Provider>,
    );

    initialState.exercises.values.forEach((exercise) => {
      const exerciseElement = screen.getByText(exercise.name);

      expect(exerciseElement).toBeInTheDocument();
    });
  });

  test('that it centers the add button when no exercises present', () => {
    render(
      <Provider store={emptyStore}>
        <ExercisesPage />
      </Provider>,
    );

    const container = screen.getByTestId('exercises-page-container');
    expect(container).toHaveClass('justify-center');
  });

  test("that it doesn't centers the add button when there are exercises present", () => {
    render(
      <Provider store={store}>
        <ExercisesPage />
      </Provider>,
    );

    const container = screen.getByTestId('exercises-page-container');
    expect(container).not.toHaveClass('justify-center');
  });
});
