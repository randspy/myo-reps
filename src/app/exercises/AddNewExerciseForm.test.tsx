import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { AddNewExerciseForm } from './AddNewExerciseForm';

describe('AddNewExerciseForm', () => {
  test('renders form fields correctly', () => {
    render(<AddNewExerciseForm onSubmit={() => {}} />);

    expect(screen.getByLabelText('Exercise Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('calls onSubmit with form values when submit button is clicked', async () => {
    const onSubmitMock = vi.fn();
    render(
      <AddNewExerciseForm
        onSubmit={(values) => {
          console.log('onSubmitMock', values);
          onSubmitMock(values);
        }}
      />,
    );

    const exerciseNameInput = screen.getByLabelText('Exercise Name');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByTestId('add-new-exercise-form');

    act(() => {
      fireEvent.change(exerciseNameInput, { target: { value: 'Push-ups' } });
      fireEvent.change(descriptionInput, {
        target: { value: 'Perform push-ups exercise' },
      });
    });

    expect(exerciseNameInput).toHaveValue('Push-ups');
    expect(descriptionInput).toHaveValue('Perform push-ups exercise');

    act(() => {
      fireEvent.submit(submitButton);
    });

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        name: 'Push-ups',
        description: 'Perform push-ups exercise',
      });
    });
  });
});
