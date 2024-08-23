import { act, render, screen, waitFor } from '@testing-library/react';
import { ExerciseList } from './ExerciseList';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from '@/features/exercises/exercises-slice';
import { ExerciseValue } from '@/features/exercises/exercises-schema';
import { generateExercise } from '@/lib/test-utils';

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

const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
  },
  preloadedState: initialState,
});

const editExercise = vi.fn();
const deleteExercise = vi.fn();

vi.mock('@/app/exercises/EditExerciseDialog', () => ({
  EditExerciseDialog: ({ exercise }: { exercise: ExerciseValue }) => {
    editExercise(exercise);
    return <div></div>;
  },
}));

vi.mock('@/app/exercises/DeleteExerciseDialog', () => ({
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
  beforeEach(() => {
    render(
      <Provider store={store}>
        <ExerciseList />
      </Provider>,
    );
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
      const state = store.getState();
      const exercises = state.exercises.values;

      expect(exercises).toEqual([
        { ...initialState.exercises.values[1], position: 0 },
        { ...initialState.exercises.values[0], position: 1 },
      ]);
    });
  });
});
