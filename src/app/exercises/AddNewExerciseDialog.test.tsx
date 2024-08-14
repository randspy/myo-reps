import { render, screen, fireEvent, act } from '@testing-library/react';
import { AddNewExerciseDialog } from './AddNewExerciseDialog';
import { NewExerciseFormValues } from '@/features/exercises/exercises-schema';

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
          name: 'Push up',
          description: 'Push up description',
        })
      }
    >
      Save
    </button>
  ),
}));

describe('AddNewExerciseDialog', () => {
  test('renders the dialog trigger', () => {
    render(<AddNewExerciseDialog onSubmit={() => {}} />);
    const dialogTrigger = screen.getByRole('button', {
      name: 'Add New Exercise',
    });
    expect(dialogTrigger).toBeInTheDocument();
  });

  test('opens the dialog when the trigger is clicked', () => {
    render(<AddNewExerciseDialog onSubmit={() => {}} />);
    const dialogTrigger = screen.getByRole('button', {
      name: 'Add New Exercise',
    });
    fireEvent.click(dialogTrigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  test('closes the dialog when the form is submitted', async () => {
    const submitMock = vi.fn();
    render(<AddNewExerciseDialog onSubmit={submitMock} />);
    const dialogTrigger = screen.getByRole('button', {
      name: 'Add New Exercise',
    });

    act(() => {
      fireEvent.click(dialogTrigger);
    });

    const submitButton = screen.getByTestId('save');

    act(() => {
      fireEvent.click(submitButton);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(submitMock).toHaveBeenCalledWith({
      name: 'Push up',
      description: 'Push up description',
    });
  });
});
