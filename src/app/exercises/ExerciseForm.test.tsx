import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { ExerciseForm } from './ExerciseForm';

describe('ExerciseForm', () => {
  test('renders form fields correctly', () => {
    render(<ExerciseForm onSubmit={() => {}} />);

    expect(screen.getByLabelText('Exercise Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('renders form fields with default values', () => {
    render(<ExerciseForm onSubmit={() => {}} />);

    expect(screen.getByLabelText('Exercise Name')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
  });

  test('renders form fields with provided values', () => {
    render(
      <ExerciseForm
        onSubmit={() => {}}
        values={{
          name: 'Push-ups',
          description: 'Perform push-ups exercise',
        }}
      />,
    );

    expect(screen.getByLabelText('Exercise Name')).toHaveValue('Push-ups');
    expect(screen.getByLabelText('Description')).toHaveValue(
      'Perform push-ups exercise',
    );
  });

  test('calls onSubmit with form values when submit button is clicked', async () => {
    const onSubmitMock = vi.fn();
    render(
      <ExerciseForm
        onSubmit={(values) => {
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
