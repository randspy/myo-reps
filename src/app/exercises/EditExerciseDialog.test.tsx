import { screen, fireEvent, waitFor } from '@testing-library/react';
import { EditExerciseDialog } from './EditExerciseDialog';
import { ExerciseFormValues } from '@/features/exercises/exercises-schema';
import {
  AppStore,
  generateExercise,
  renderWithProviders,
} from '@/lib/test-utils';

const initialState = {
  exercises: {
    values: [
      generateExercise({
        id: '1',
        name: 'Push-up',
      }),
    ],
  },
};

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
          description: 'Push up description',
        })
      }
    >
      Save
    </button>
  ),
}));

describe('Edit exercise', () => {
  const exercise = generateExercise({
    id: '1',
    name: 'Push-up',
  });
  let store: AppStore;

  beforeEach(() => {
    store = renderWithProviders(<EditExerciseDialog exercise={exercise} />, {
      preloadedState: initialState,
    }).store;

    fireEvent.click(screen.getByLabelText('Edit exercise'));
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
      expect(store.getState().exercises.values[0].name).toEqual('Mock Push up');
    });
  });
});
