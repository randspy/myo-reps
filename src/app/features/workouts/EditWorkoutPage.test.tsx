import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { generateWorkout } from '@/lib/test-utils';
import { ChildrenFunction } from '@/app/ui/UnsavedFormChangesBlocker';
import {
  WorkoutFormValues,
  WorkoutValue,
} from '@/app/core/workouts/workouts-schema';
import { EditWorkoutPage } from './EditWorkoutPage';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';

vi.mock('@/app/features/workouts/WorkoutForm', () => ({
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

const renderEditWorkoutPage = (id: string = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/workouts/${id}`]}>
      <Routes>
        <Route path="/workouts/:id" element={<EditWorkoutPage />} />
        <Route path="/workouts" element={<div>Workouts Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Edit workout page', () => {
  let workouts: WorkoutValue[];

  beforeEach(() => {
    workouts = [
      generateWorkout({
        id: '1',
        position: 0,
        name: 'Upper body',
      }),
    ];
    useWorkoutsStore.setState({ workouts });
  });

  test('update workout', async () => {
    renderEditWorkoutPage();

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      const updatedWorkout = useWorkoutsStore.getState().workouts[0];
      expect(updatedWorkout.name).toEqual('Mock Upper body');
      expect(screen.getByText('Workouts Page')).toBeInTheDocument();
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('navigate to /exercises on cancel', () => {
    renderEditWorkoutPage();

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByText('Workouts Page')).toBeInTheDocument();
    expect(useWorkoutsStore.getState().workouts[0].name).toEqual('Upper body');
  });

  test('block unsaved changes', () => {
    renderEditWorkoutPage();

    fireEvent.click(screen.getByText('Simulate dirty change'));

    expect(mockOnDirtyChange).toHaveBeenCalledWith(true);
  });

  test('should render 404 page if workout is not found', () => {
    render(
      <MemoryRouter initialEntries={['/2']}>
        <Routes>
          <Route path="/:id" element={<EditWorkoutPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
