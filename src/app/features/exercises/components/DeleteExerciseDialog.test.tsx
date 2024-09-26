import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { DeleteExerciseDialog } from '@/app/features/exercises/components/DeleteExerciseDialog';
import { generateExercise } from '@/lib/test-utils';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';

const renderDeleteExerciseDialog = (exercise: ExerciseValue) => {
  return render(<DeleteExerciseDialog exercise={exercise} />);
};

describe('Delete exercise', () => {
  let exercise: ExerciseValue;

  beforeEach(() => {
    exercise = generateExercise({
      id: '1',
      name: 'Push-up',
    });

    renderDeleteExerciseDialog(exercise);

    fireEvent.click(screen.getByLabelText('Delete exercise'));
  });

  test('opens the dialog when the trigger is clicked', () => {
    expect(
      screen.getByRole('heading', {
        name: 'Are you sure you want to delete this exercise?',
      }),
    ).toBeInTheDocument();
  });

  test('closes the dialog when the cancel button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('heading', {
        name: 'Are you sure you want to delete this exercise?',
      }),
    ).not.toBeInTheDocument();
  });

  test('calls the deleteExercise function when the confirm button is clicked', async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(useExercisesStore.getState().exercises.length).toEqual(0);
    });
  });
});
