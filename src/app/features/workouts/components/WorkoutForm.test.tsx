import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { WorkoutForm } from '@/app/features/workouts/components/WorkoutForm';
import { generateExercise } from '@/lib/test-utils';
import { WorkoutFormValues } from '@/app/core/workouts/workouts-types';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { v4 } from 'uuid';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();
const mockOnDirtyChange = vi.fn();

const renderWorkoutForm = (initialValues?: WorkoutFormValues) => {
  return render(
    <WorkoutForm
      onSubmit={mockOnSubmit}
      onCancel={mockOnCancel}
      onDirtyChange={mockOnDirtyChange}
      values={initialValues}
    />,
  );
};

describe('Workout form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useExercisesStore.setState({
      exercises: [
        generateExercise({ id: '1', name: 'Push-up' }),
        generateExercise({ id: '2', name: 'Pull-up', hidden: true }),
      ],
    });
  });

  test('renders the form correctly', () => {
    renderWorkoutForm();

    expect(screen.getByLabelText('Workout Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Add Exercise')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('adds a new exercise when "Add Exercise" button is clicked', async () => {
    renderWorkoutForm();

    fireEvent.click(screen.getByText('Add Exercise'));

    await waitFor(() => {
      expect(screen.getByText('Select Exercise')).toBeInTheDocument();
    });
  });

  test('selects the exercise', async () => {
    renderWorkoutForm();

    fireEvent.click(screen.getByText('Add Exercise'));
    fireEvent.click(screen.getByText('Select Exercise'));

    await waitFor(() => {
      expect(screen.getByText('Push-up')).toBeInTheDocument();
      expect(screen.queryByText('Pull-up')).not.toBeInTheDocument();
    });
  });

  test('submits the form when "Save" button is clicked', async () => {
    const id = '16281fc7-56d7-4cba-b5c0-d3c3856ca604';
    vi.mocked(v4).mockImplementation(() => id);

    renderWorkoutForm();

    fireEvent.change(screen.getByLabelText('Workout Name'), {
      target: { value: 'Upper body workout' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Workout description' },
    });

    fireEvent.click(screen.getByText('Add Exercise'));
    fireEvent.click(screen.getByText('Select Exercise'));
    fireEvent.click(screen.getByText('Push-up'));
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Upper body workout',
        description: 'Workout description',
        exercises: [
          {
            id,
            exerciseId: '1',
            sets: 2,
          },
        ],
      });
    });
  });

  test('deletes an exercise when "Delete" button is clicked', async () => {
    renderWorkoutForm();

    fireEvent.click(screen.getByText('Add Exercise'));
    fireEvent.click(screen.getByText('Select Exercise'));
    fireEvent.click(screen.getByText('Push-up'));
    fireEvent.click(screen.getByLabelText('Delete exercise'));

    await waitFor(() => {
      expect(screen.queryByText('Push-up')).not.toBeInTheDocument();
    });
  });

  test('cancels form', () => {
    renderWorkoutForm();

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('resets form', () => {
    renderWorkoutForm({
      name: 'Upper body',
      description: 'Upper body workout',
      exercises: [],
    });

    fireEvent.change(screen.getByLabelText('Workout Name'), {
      target: { value: 'Lower body' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Lower body workout' },
    });

    fireEvent.click(screen.getByText('Reset'));

    expect(screen.getByLabelText('Workout Name')).toHaveValue('Upper body');
    expect(screen.getByLabelText('Description')).toHaveValue(
      'Upper body workout',
    );
  });

  test('calls onDirtyChange on isDirty form property change', () => {
    renderWorkoutForm();

    fireEvent.change(screen.getByLabelText('Workout Name'), {
      target: { value: 'Split' },
    });

    expect(mockOnDirtyChange).toHaveBeenCalledWith(true);
  });
});
