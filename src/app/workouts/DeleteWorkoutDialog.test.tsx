import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import workoutsReducer from '@/features/workouts/workouts-slice';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { DeleteWorkoutDialog } from '@/app/workouts/DeleteWorkoutDialog';

const initialValue = {
  workouts: {
    values: [
      { id: '1', name: 'Upper body', description: 'Upper body description' },
    ],
  },
};

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
  preloadedState: initialValue,
});

describe('Delete workout', () => {
  const workout = initialValue.workouts.values[0];

  beforeEach(() => {
    render(
      <Provider store={store}>
        <DeleteWorkoutDialog workout={workout} />{' '}
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText('Delete workout'));
  });

  it('opens the dialog when the trigger is clicked', () => {
    expect(
      screen.getByRole('heading', {
        name: 'Are you sure you want to delete this workout?',
      }),
    ).toBeInTheDocument();
  });

  it('closes the dialog when the cancel button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('heading', {
        name: 'Are you sure you want to delete this workout?',
      }),
    ).not.toBeInTheDocument();
  });

  it('calls the deleteWorkout function when the confirm button is clicked', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      const state = store.getState();
      const workouts = state.workouts.values;

      expect(workouts.length).toEqual(0);
    });
  });
});
