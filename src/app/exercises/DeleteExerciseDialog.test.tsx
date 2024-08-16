import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteExerciseDialog } from '@/app/exercises/DeleteExerciseDialog';
import exercisesReducer from '@/features/exercises/exercises-slice';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const initialValue = {
  exercises: {
    values: [{ id: '1', name: 'Push-up', description: 'Push up description' }],
  },
};

const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
  },
  preloadedState: initialValue,
});

describe('DeleteExerciseDialog', () => {
  const exercise = initialValue.exercises.values[0];
  let dialogTrigger: HTMLElement;

  beforeEach(() => {
    render(
      <Provider store={store}>
        <DeleteExerciseDialog exercise={exercise} />{' '}
      </Provider>,
    );
    dialogTrigger = screen.getByTestId('exercise-delete-button');
  });

  it('renders the dialog trigger', () => {
    expect(dialogTrigger).toBeInTheDocument();
  });

  it('opens the dialog when the trigger is clicked', () => {
    fireEvent.click(dialogTrigger);

    const dialogTitle = screen.getByRole('heading', {
      name: 'Are you sure you want to delete this exercise?',
    });
    expect(dialogTitle).toBeInTheDocument();
  });

  it('closes the dialog when the cancel button is clicked', () => {
    fireEvent.click(dialogTrigger);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    fireEvent.click(cancelButton);

    const dialogTitle = screen.queryByRole('heading', {
      name: 'Are you sure you want to delete this exercise?',
    });
    expect(dialogTitle).not.toBeInTheDocument();
  });

  it('calls the deleteExercise function when the confirm button is clicked', async () => {
    fireEvent.click(dialogTrigger);

    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      const state = store.getState();
      const exercises = state.exercises.values;

      expect(exercises.length).toEqual(0);
    });
  });
});
