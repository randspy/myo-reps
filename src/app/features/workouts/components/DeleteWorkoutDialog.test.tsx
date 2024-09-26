import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { DeleteWorkoutDialog } from '@/app/features/workouts/components/DeleteWorkoutDialog';
import { generateWorkout } from '@/lib/test-utils';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';

const renderDeleteWorkoutDialog = (workout: WorkoutValue) => {
  return render(<DeleteWorkoutDialog workout={workout} />);
};

describe('Delete workout', () => {
  let workout: WorkoutValue;

  beforeEach(() => {
    workout = generateWorkout({
      id: '1',
      position: 0,
      name: 'Upper body',
    });

    renderDeleteWorkoutDialog(workout);

    fireEvent.click(screen.getByLabelText('Delete workout'));
  });

  test('opens the dialog when the trigger is clicked', () => {
    expect(
      screen.getByRole('heading', {
        name: 'Are you sure you want to delete this workout?',
      }),
    ).toBeInTheDocument();
  });

  test('closes the dialog when the cancel button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('heading', {
        name: 'Are you sure you want to delete this workout?',
      }),
    ).not.toBeInTheDocument();
  });

  test('deletes the workout when the confirm button is clicked', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      const workouts = useWorkoutsStore.getState().workouts;
      expect(workouts.length).toBe(0);
    });
  });
});
