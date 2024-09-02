import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExerciseForm } from './ExerciseForm';

describe('Exercise form', () => {
  test('renders form fields correctly', () => {
    render(<ExerciseForm onSubmit={() => {}} onCancel={() => {}} />);

    expect(screen.getByLabelText('Exercise Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('renders form fields with default values', () => {
    render(<ExerciseForm onSubmit={() => {}} onCancel={() => {}} />);

    expect(screen.getByLabelText('Exercise Name')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
  });

  test('renders form fields with provided values', () => {
    render(
      <ExerciseForm
        onSubmit={() => {}}
        onCancel={() => {}}
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

  test('saves changes to local storage', () => {
    render(
      <ExerciseForm
        onSubmit={() => {}}
        onCancel={() => {}}
        values={{
          name: 'Push-ups',
          description: 'Perform push-ups exercise',
        }}
      />,
    );

    fireEvent.change(screen.getByLabelText('Exercise Name'), {
      target: { value: 'New push-ups' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New perform push-ups exercise' },
    });

    const storedData = JSON.parse(localStorage.getItem('exercises') || '{}');

    expect(storedData).toMatchObject({
      name: 'New push-ups',
      description: 'New perform push-ups exercise',
    });
    expect(storedData._timestamp).toBeDefined();
  });

  test('submits form', async () => {
    const onSubmitMock = vi.fn();
    render(
      <ExerciseForm
        onSubmit={(values) => {
          onSubmitMock(values);
        }}
        onCancel={() => {}}
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

    expect(localStorage.getItem('exercises')).toBeNull();
  });

  test('cancels form', () => {
    const onCancelMock = vi.fn();
    render(
      <ExerciseForm
        onSubmit={() => {}}
        onCancel={() => {
          onCancelMock();
        }}
      />,
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancelMock).toHaveBeenCalled();
  });

  test('resets form', () => {
    render(
      <ExerciseForm
        onSubmit={() => {}}
        onCancel={() => {}}
        values={{
          name: 'Push-ups',
          description: 'Perform push-ups exercise',
        }}
      />,
    );

    fireEvent.change(screen.getByLabelText('Exercise Name'), {
      target: { value: 'Squats' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Perform squats exercise' },
    });

    fireEvent.click(screen.getByText('Reset'));

    expect(screen.getByLabelText('Exercise Name')).toHaveValue('Push-ups');
    expect(screen.getByLabelText('Description')).toHaveValue(
      'Perform push-ups exercise',
    );

    expect(localStorage.getItem('exercises')).toBeNull();
  });
});
