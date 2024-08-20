import { render, screen } from '@testing-library/react';
import { ExerciseList } from './ExerciseList';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from '@/features/exercises/exercises-slice';
import { ExerciseValue } from '@/features/exercises/exercises-schema';

const initialState = {
  exercises: {
    values: [{ id: '1', name: 'Push-up', description: 'Push up description' }],
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
});
