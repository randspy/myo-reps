import { screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteExerciseDialog } from '@/app/features/exercises/DeleteExerciseDialog';
import {
  AppStore,
  generateExercise,
  renderWithProviders,
} from '@/lib/test-utils';

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

describe('Delete exercise', () => {
  const exercise = initialValue.exercises.values[0];
  let store: AppStore;

  beforeEach(() => {
    store = renderWithProviders(<DeleteExerciseDialog exercise={exercise} />, {
      preloadedState: initialValue,
    }).store;

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
      expect(store.getState().exercises.values.length).toEqual(0);
    });
  });
});
