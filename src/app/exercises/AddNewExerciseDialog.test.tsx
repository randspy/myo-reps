import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddNewExerciseDialog } from './AddNewExerciseDialog';
import { ExerciseFormValues } from '@/features/exercises/exercises-schema';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

vi.mock('@/app/exercises/ExerciseForm', () => ({
  ExerciseForm: ({
    onSubmit,
  }: {
    onSubmit: (values: ExerciseFormValues) => void;
  }) => (
    <button
      data-testid="save"
      onClick={() =>
        onSubmit({
          name: 'Mock Push up',
        })
      }
    >
      Save
    </button>
  ),
}));

describe('Add new exercise', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <AddNewExerciseDialog />
      </Provider>,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Add New Exercise',
      }),
    );
  });

  test('opens the dialog when the trigger is clicked', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('closes the dialog when the form is submitted', async () => {
    fireEvent.click(screen.getByTestId('save'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('add exercise to the store when the form is submitted', async () => {
    fireEvent.click(screen.getByTestId('save'));

    await waitFor(() => {
      const state = store.getState();
      const exercises = state.exercises.values;
      const newExercise = exercises.find(
        (exercise) => exercise.name === 'Mock Push up',
      );

      expect(newExercise).toBeDefined();
    });
  });
});
