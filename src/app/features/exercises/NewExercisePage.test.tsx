import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NewExercisePage } from './NewExercisePage';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';
import { ChildrenFunction } from '@/app/ui/UnsavedFormChangesBlocker';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';

vi.mock('@/app/features/exercises/ExerciseForm', () => ({
  ExerciseForm: ({
    onSubmit,
    onCancel,
    onDirtyChange,
  }: {
    onSubmit: (values: ExerciseFormValues) => void;
    onCancel: () => void;
    onDirtyChange: (value: boolean) => void;
  }) => (
    <div>
      <button
        onClick={() =>
          onSubmit({
            name: 'Mock Push up',
          })
        }
      >
        Save
      </button>
      <button
        onClick={() => {
          onCancel();
        }}
      >
        Cancel
      </button>
      <button onClick={() => onDirtyChange(true)}>Simulate dirty change</button>
    </div>
  ),
}));

const mockOnDirtyChange = vi.fn();
const mockOnSubmit = vi.fn();

vi.mock('@/app/ui/UnsavedFormChangesBlocker', () => ({
  UnsavedFormChangesBlocker: ({ children }: { children: ChildrenFunction }) =>
    children(mockOnDirtyChange, mockOnSubmit),
}));

const renderNewExercisePage = () => {
  return render(
    <MemoryRouter initialEntries={['/exercises/new']}>
      <Routes>
        <Route path="/exercises/new" element={<NewExercisePage />} />
        <Route path="/exercises" element={<div>Exercises Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('New exercise page', () => {
  beforeEach(() => {
    useExercisesStore.setState({ exercises: [] });
  });

  test('should add exercise and navigate on form submission', async () => {
    renderNewExercisePage();

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      const exercises = useExercisesStore.getState().exercises;
      expect(exercises).toHaveLength(1);
      expect(exercises[0].name).toEqual('Mock Push up');
      expect(screen.getByText('Exercises Page')).toBeInTheDocument();
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('should navigate to /exercises on cancel', async () => {
    renderNewExercisePage();

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.getByText('Exercises Page')).toBeInTheDocument();
      expect(useExercisesStore.getState().exercises).toHaveLength(0);
    });
  });

  test('should block unsaved changes', () => {
    renderNewExercisePage();

    fireEvent.click(screen.getByText('Simulate dirty change'));

    expect(mockOnDirtyChange).toHaveBeenCalledWith(true);
  });
});
