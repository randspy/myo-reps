import { render, screen } from '@testing-library/react';
import { ExercisesPage } from '@/app/exercises/ExercisesPage';
import { Provider } from 'react-redux';
import { store as emptyStore } from '@/store/store';
import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from '@/features/exercises/exercises-slice';

const initialState = {
  exercises: {
    values: [
      { id: '1', name: 'Push-up', description: 'Push up description' },
      { id: '2', name: 'Squat', description: 'Squat description' },
    ],
  },
};

const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
  },
  preloadedState: initialState,
});

describe('ExercisePage', () => {
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
