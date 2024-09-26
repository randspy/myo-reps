import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChildrenFunction } from '@/app/ui/UnsavedFormChangesBlocker';
import { WorkoutFormValues } from '@/app/core/workouts/workouts-types';
import { NewWorkoutPage } from './NewWorkoutPage';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';

vi.mock('@/app/features/workouts/components/WorkoutForm', () => ({
  WorkoutForm: ({
    onSubmit,
    onCancel,
    onDirtyChange,
  }: {
    onSubmit: (values: WorkoutFormValues) => void;
    onCancel: () => void;
    onDirtyChange: (value: boolean) => void;
  }) => (
    <div>
      <button
        onClick={() =>
          onSubmit({
            name: 'Mock Upper body',
            exercises: [],
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

const renderNewWorkoutPage = () => {
  return render(
    <MemoryRouter initialEntries={['/workouts/new']}>
      <Routes>
        <Route path="/workouts/new" element={<NewWorkoutPage />} />
        <Route path="/workouts" element={<div>Workouts Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('New workout page', () => {
  beforeEach(() => {
    useWorkoutsStore.setState({ workouts: [] });
  });

  test('should add workout and navigate on form submission', async () => {
    renderNewWorkoutPage();

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      const workouts = useWorkoutsStore.getState().workouts;
      expect(workouts).toHaveLength(1);
      expect(workouts[0].name).toEqual('Mock Upper body');
      expect(screen.getByText('Workouts Page')).toBeInTheDocument();
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('should navigate to /workouts on cancel', () => {
    renderNewWorkoutPage();

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByText('Workouts Page')).toBeInTheDocument();
    expect(useWorkoutsStore.getState().workouts).toHaveLength(0);
  });

  test('should block unsaved changes', () => {
    renderNewWorkoutPage();

    fireEvent.click(screen.getByText('Simulate dirty change'));

    expect(mockOnDirtyChange).toHaveBeenCalledWith(true);
  });
});
