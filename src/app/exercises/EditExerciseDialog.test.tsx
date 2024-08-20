import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditExerciseDialog } from './EditExerciseDialog';
import { ExerciseFormValues } from '@/features/exercises/exercises-schema';
import { Provider } from 'react-redux';
import exercisesReducer from '@/features/exercises/exercises-slice';
import { configureStore } from '@reduxjs/toolkit';

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

vi.mock('@/app/exercises/ExerciseForm', () => ({
  ExerciseForm: ({
    onSubmit,
  }: {
    onSubmit: (values: ExerciseFormValues) => void;
  }) => (
    <button
      data-testid="save"
      onClick={() =>
        onSubmit({
          name: 'Mock Push up',
          description: 'Push up description',
        })
      }
    >
      Save
    </button>
  ),
}));

describe('Edit exercise', () => {
  const exercise = {
    id: '1',
    name: 'Push-up',
    description: 'Push up description',
  };

  beforeEach(() => {
    render(
      <Provider store={store}>
        <EditExerciseDialog exercise={exercise} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('exercise-edit-button'));
  });

  test('opens the dialog when the trigger is clicked', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('closes the dialog when the form is submitted', async () => {
    fireEvent.click(screen.getByTestId('save'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('update exercise to the store when the form is submitted', async () => {
    fireEvent.click(screen.getByTestId('save'));

    await waitFor(() => {
      const state = store.getState();
      const exercises = state.exercises.values;
      const exercise = exercises.find((exercise) => exercise.id === '1');

      expect(exercise).toBeDefined();
      expect(exercise?.name).toEqual('Mock Push up');
    });
  });
});
