import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExerciseForm } from './ExerciseForm';

describe('Exercise form', () => {
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

    fireEvent.change(screen.getByLabelText('Exercise Name'), {
      target: { value: 'Push-ups' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Perform push-ups exercise' },
    });
    fireEvent.submit(screen.getByTestId('add-new-exercise-form'));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        name: 'Push-ups',
        description: 'Perform push-ups exercise',
      });
    });
  });
});
