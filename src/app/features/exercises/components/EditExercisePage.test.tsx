import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { generateExercise } from '@/lib/test-utils';
import {
  ExerciseFormValues,
  ExerciseValue,
} from '@/app/core/exercises/exercises-types';
import { ChildrenFunction } from '@/app/ui/UnsavedFormChangesBlocker';
import { EditExercisePage } from './EditExercisePage';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';

vi.mock('@/app/features/exercises/components/ExerciseForm', () => ({
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

const renderEditExercisePage = (id: string) => {
  return render(
    <MemoryRouter initialEntries={[`/exercises/${id}`]}>
      <Routes>
        <Route path="/exercises/:id" element={<EditExercisePage />} />
        <Route path="/exercises" element={<div>Exercises Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Edit exercise page', () => {
  let exercises: ExerciseValue[];

  beforeEach(() => {
    exercises = [
      generateExercise({
        id: '1',
        position: 0,
        name: 'Push-up',
      }),
    ];
    useExercisesStore.setState({ exercises });
  });

  test('update exercise', async () => {
    renderEditExercisePage('1');

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      const updatedExercise = useExercisesStore.getState().exercises[0];
      expect(updatedExercise.name).toEqual('Mock Push up');
      expect(screen.getByText('Exercises Page')).toBeInTheDocument();
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  test('navigate to /exercises on cancel', () => {
    renderEditExercisePage('1');

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByText('Exercises Page')).toBeInTheDocument();
    expect(useExercisesStore.getState().exercises[0].name).toEqual('Push-up');
  });

  test('block unsaved changes', () => {
    renderEditExercisePage('1');

    fireEvent.click(screen.getByText('Simulate dirty change'));

    expect(mockOnDirtyChange).toHaveBeenCalledWith(true);
  });

  test('should render 404 page if exercise is not found', () => {
    renderEditExercisePage('2');

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
