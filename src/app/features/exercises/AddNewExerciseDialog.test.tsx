import { screen, fireEvent, waitFor } from '@testing-library/react';
import { AddNewExerciseDialog } from './AddNewExerciseDialog';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';
import { AppStore, renderWithProviders } from '@/lib/test-utils';

vi.mock('@/app/features/exercises/ExerciseForm', () => ({
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
  let store: AppStore;

  beforeEach(() => {
    store = renderWithProviders(<AddNewExerciseDialog />, {
      preloadedState: {
        exercises: {
          values: [],
        },
      },
    }).store;

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
      expect(store.getState().exercises.values[0].name).toEqual('Mock Push up');
    });
  });
});
