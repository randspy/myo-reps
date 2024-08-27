import { screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteWorkoutDialog } from '@/app/features/workouts/DeleteWorkoutDialog';
import {
  AppStore,
  generateWorkout,
  renderWithProviders,
} from '@/lib/test-utils';

const initialValue = {
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

describe('Delete workout', () => {
  const workout = initialValue.workouts.values[0];
  let store: AppStore;

  beforeEach(() => {
    store = renderWithProviders(<DeleteWorkoutDialog workout={workout} />, {
      preloadedState: initialValue,
    }).store;

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
      expect(store.getState().workouts.values.length).toEqual(0);
    });
  });
});
