import { render, screen } from '@testing-library/react';
import { ExerciseList } from './ExerciseList';
import { Provider } from 'react-redux';
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

describe('ExerciseList', () => {
  it('renders the list of exercises', () => {
    render(
      <Provider store={store}>
        <ExerciseList />
      </Provider>,
    );

    initialState.exercises.values.forEach((exercise) => {
      const exerciseElement = screen.getByText(exercise.name);

      expect(exerciseElement).toBeInTheDocument();
    });
  });

  it('deletes an exercise when the delete button is clicked', async () => {
    render(
      <Provider store={store}>
        <ExerciseList />
      </Provider>,
    );

    const editButtons = await screen.findAllByTestId('exercise-edit-button');
    const deleteButtons = await screen.findAllByTestId(
      'exercise-delete-button',
    );

    expect(editButtons).toHaveLength(initialState.exercises.values.length);
    expect(deleteButtons).toHaveLength(initialState.exercises.values.length);
  });
});
