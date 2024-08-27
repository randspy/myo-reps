import { act, screen, waitFor } from '@testing-library/react';
import { ExerciseList } from './ExerciseList';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import {
  AppStore,
  generateExercise,
  renderWithProviders,
} from '@/lib/test-utils';

const initialState = {
  exercises: {
    values: [
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
    ],
  },
};

const editExercise = vi.fn();
const deleteExercise = vi.fn();

vi.mock('@/app/features/exercises/EditExerciseDialog', () => ({
  EditExerciseDialog: ({ exercise }: { exercise: ExerciseValue }) => {
    editExercise(exercise);
    return <div></div>;
  },
}));

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

describe('Exercise list', () => {
  let store: AppStore;

  beforeEach(() => {
    store = renderWithProviders(<ExerciseList />, {
      preloadedState: initialState,
    }).store;
  });

  it('renders the list of exercises', () => {
    initialState.exercises.values.forEach((exercise) => {
      expect(screen.getByText(exercise.name)).toBeInTheDocument();
    });
  });

  it('pass through workouts to child components', async () => {
    expect(editExercise).toHaveBeenCalledWith(initialState.exercises.values[0]);
    expect(deleteExercise).toHaveBeenCalledWith(
      initialState.exercises.values[0],
    );
  });

  it('simulate drag and drop', async () => {
    act(() => {
      onReorder([
        initialState.exercises.values[1],
        initialState.exercises.values[0],
      ]);
    });

    await waitFor(() => {
      expect(store.getState().exercises.values).toEqual([
        { ...initialState.exercises.values[1], position: 0 },
        { ...initialState.exercises.values[0], position: 1 },
      ]);
    });
  });
});
