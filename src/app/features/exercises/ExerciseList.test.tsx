import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { generateExercise } from '@/lib/test-utils';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ExerciseList } from './ExerciseList';

const deleteExercise = vi.fn();

vi.mock('@/app/features/exercises/DeleteExerciseDialog', () => ({
  DeleteExerciseDialog: ({ exercise }: { exercise: ExerciseValue }) => {
    deleteExercise(exercise);
    return <div></div>;
  },
}));

let onReorder: (values: ExerciseValue[]) => void;

vi.mock('framer-motion', () => ({
  Reorder: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Group: (props: any) => {
      onReorder = props.onReorder;
      return <div data-testid="reorder-group">{props.children}</div>;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Item: (props: any) => (
      <div {...props} data-testid="reorder-item">
        {props.children}
      </div>
    ),
  },
}));

const renderExerciseList = () => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<ExerciseList />} />
        <Route path="/exercises/:id" element={<div>Mock Edit Exercise</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Exercise list', () => {
  let exercises: ExerciseValue[];

  beforeEach(() => {
    exercises = [
      generateExercise({
        id: '1',
        name: 'Push-up',
        position: 0,
      }),
      generateExercise({
        id: '2',
        name: 'Squats',
        position: 1,
      }),
    ];
    useExercisesStore.setState({ exercises });
    renderExerciseList();
  });

  test('renders the list of exercises', () => {
    exercises.forEach((exercise) => {
      expect(screen.getByText(exercise.name)).toBeInTheDocument();
    });
  });

  test('pass through exercises to child components', () => {
    expect(deleteExercise).toHaveBeenCalledWith(exercises[0]);
  });

  test('redirect to edit page', () => {
    fireEvent.click(screen.getAllByLabelText('Edit exercise')[0]);
    expect(screen.getByText('Mock Edit Exercise')).toBeInTheDocument();
  });

  test('simulate drag and drop', async () => {
    act(() => {
      onReorder([exercises[1], exercises[0]]);
    });

    await waitFor(() => {
      expect(useExercisesStore.getState().exercises).toEqual([
        { ...exercises[1], position: 0 },
        { ...exercises[0], position: 1 },
      ]);
    });
  });
});
