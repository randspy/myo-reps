import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import workoutsReducer from '@/features/workouts/workouts-slice';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { WorkoutFormValues } from '@/features/workouts/workouts-schema';
import { EditWorkoutDialog } from '@/app/workouts/EditWorkoutDialog';
import { generateWorkout } from '@/lib/test-utils';

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

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
  preloadedState: initialState,
});

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

  beforeEach(() => {
    render(
      <Provider store={store}>
        <EditWorkoutDialog workout={workout} />
      </Provider>,
    );

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
      const state = store.getState();
      const exercises = state.workouts.values;
      const workout = exercises.find((workout) => workout.id === '1');

      expect(workout).toBeDefined();
      expect(workout?.name).toEqual('Mock upper body workout');
    });
  });
});
