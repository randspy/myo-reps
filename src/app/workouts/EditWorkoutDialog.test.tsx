import { screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkoutFormValues } from '@/features/workouts/workouts-schema';
import { EditWorkoutDialog } from '@/app/workouts/EditWorkoutDialog';
import {
  AppStore,
  generateWorkout,
  renderWithProviders,
} from '@/lib/test-utils';

const initialState = {
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

vi.mock('@/app/workouts/WorkoutForm', () => ({
  WorkoutForm: ({
    onSubmit,
  }: {
    onSubmit: (values: WorkoutFormValues) => void;
  }) => (
    <button
      data-testid="save"
      onClick={() =>
        onSubmit({
          name: 'Mock upper body workout',
          description: 'Mock upper body workout description',
          exercises: [],
        })
      }
    >
      Save
    </button>
  ),
}));

describe('Edit workout', () => {
  const workout = initialState.workouts.values[0];
  let store: AppStore;

  beforeEach(() => {
    store = renderWithProviders(<EditWorkoutDialog workout={workout} />, {
      preloadedState: initialState,
    }).store;

    fireEvent.click(screen.getByLabelText('Edit workout'));
  });

  test('opens the dialog when the trigger is clicked', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('closes the dialog when the form is submitted', async () => {
    fireEvent.click(screen.getByTestId('save'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('update exercise to the store when the form is submitted', async () => {
    fireEvent.click(screen.getByTestId('save'));

    await waitFor(() => {
      expect(store.getState().workouts.values[0].name).toEqual(
        'Mock upper body workout',
      );
    });
  });
});
