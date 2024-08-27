import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { AddNewWorkoutDialog } from './AddNewWorkoutDialog';
import { WorkoutFormValues } from '@/app/core/workouts/workouts-schema';

vi.mock('@/app/features/workouts/WorkoutForm', () => ({
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

describe('Add new workout', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <AddNewWorkoutDialog />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add New Workout' }));
  });

  it('opens the dialog when the trigger is clicked', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes the dialog when the form is submitted', async () => {
    fireEvent.click(screen.getByTestId('save'));

    await waitFor(() => {
      const state = store.getState();
      const workouts = state.workouts.values;
      const newWorkout = workouts.find(
        (workout) => workout.name === 'Mock upper body workout',
      );

      expect(newWorkout).toBeDefined();
    });
  });
});
