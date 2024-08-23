import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteExerciseDialog } from '@/app/exercises/DeleteExerciseDialog';
import exercisesReducer from '@/features/exercises/exercises-slice';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { generateExercise } from '@/lib/test-utils';

const initialValue = {
  exercises: {
    values: [
      generateExercise({
        id: '1',
        name: 'Push-up',
      }),
    ],
  },
};

const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
  },
  preloadedState: initialValue,
});

describe('Delete exercise', () => {
  const exercise = initialValue.exercises.values[0];

  beforeEach(() => {
    render(
      <Provider store={store}>
        <DeleteExerciseDialog exercise={exercise} />{' '}
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText('Delete exercise'));
  });

  it('opens the dialog when the trigger is clicked', () => {
    expect(
      screen.getByRole('heading', {
        name: 'Are you sure you want to delete this exercise?',
      }),
    ).toBeInTheDocument();
  });

  it('closes the dialog when the cancel button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('heading', {
        name: 'Are you sure you want to delete this exercise?',
      }),
    ).not.toBeInTheDocument();
  });

  it('calls the deleteExercise function when the confirm button is clicked', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      const state = store.getState();
      const exercises = state.exercises.values;

      expect(exercises.length).toEqual(0);
    });
  });
});
