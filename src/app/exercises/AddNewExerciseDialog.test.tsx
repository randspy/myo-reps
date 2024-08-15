import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { AddNewExerciseDialog } from './AddNewExerciseDialog';
import { NewExerciseFormValues } from '@/features/exercises/exercises-schema';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

vi.mock('@/app/exercises/AddNewExerciseForm', () => ({
  AddNewExerciseForm: ({
    onSubmit,
  }: {
    onSubmit: (values: NewExerciseFormValues) => void;
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

describe('AddNewExerciseDialog', () => {
  let dialogTrigger: HTMLElement;

  beforeEach(() => {
    render(
      <Provider store={store}>
        <AddNewExerciseDialog />
      </Provider>,
    );

    dialogTrigger = screen.getByRole('button', {
      name: 'Add New Exercise',
    });
  });
  test('renders the dialog trigger', () => {
    expect(dialogTrigger).toBeInTheDocument();
  });

  test('opens the dialog when the trigger is clicked', () => {
    fireEvent.click(dialogTrigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  test('closes the dialog when the form is submitted', async () => {
    act(() => {
      fireEvent.click(dialogTrigger);
    });

    const submitButton = screen.getByTestId('save');

    act(() => {
      fireEvent.click(submitButton);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('add exercise to the store when the form is submitted', async () => {
    act(() => {
      fireEvent.click(dialogTrigger);
    });

    const submitButton = screen.getByTestId('save');

    act(() => {
      fireEvent.click(submitButton);
    });

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
