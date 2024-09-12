import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from '@/app/core/workouts/store/workouts-slice';
import exercisesReducer from '@/app/core/exercises/store/exercises-slice';
import { WorkoutList } from './WorkoutList';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { generateWorkout } from '@/lib/test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RootState } from '@/store/store';

const deleteWorkout = vi.fn();

vi.mock('@/app/features/workouts/DeleteWorkoutDialog', () => ({
  DeleteWorkoutDialog: ({ workout }: { workout: WorkoutValue }) => {
    deleteWorkout(workout);
    return <div></div>;
  },
}));

const renderWorkoutList = (preloadedState: RootState) => {
  const store = configureStore({
    reducer: {
      workouts: workoutsReducer,
      exercises: exercisesReducer,
    },
    preloadedState,
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/workouts']}>
        <Routes>
          <Route path="/workouts" element={<WorkoutList />} />
          <Route path="/workouts/:id" element={<div>Mock Edit Workout</div>} />
          <Route path="/sessions/new" element={<div>Mock New Session</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('Workout list', () => {
  let preloadedState: RootState;

  beforeEach(() => {
    preloadedState = {
      exercises: {
        values: [],
      },
      workouts: {
        values: [
          generateWorkout({
            id: '1',
            position: 0,
            name: 'Upper body',
            exercises: [],
          }),
        ],
      },
    };
  });

  test('renders the list of workouts', () => {
    renderWorkoutList(preloadedState);

    preloadedState.workouts.values.forEach((workouts) => {
      expect(screen.getByText(workouts.name)).toBeInTheDocument();
    });
  });

  test('pass through workouts to child components', async () => {
    renderWorkoutList(preloadedState);

    expect(deleteWorkout).toHaveBeenCalledWith(
      preloadedState.workouts.values[0],
    );
  });

  test('redirect to edit page', () => {
    renderWorkoutList(preloadedState);

    fireEvent.click(screen.getAllByLabelText('Edit workout')[0]);
    expect(screen.getByText('Mock Edit Workout')).toBeInTheDocument();
  });

  test('redirect to new session page for a given workout', () => {
    preloadedState.workouts.values[0].exercises = [
      { id: '1', exerciseId: '1', sets: 3 },
    ];

    renderWorkoutList(preloadedState);

    fireEvent.click(screen.getByLabelText('Start workout'));
    expect(screen.getByText('Mock New Session')).toBeInTheDocument();
  });

  test('no redirect button to new session page when missing exercises', () => {
    renderWorkoutList(preloadedState);

    expect(screen.queryByText('Start workout')).not.toBeInTheDocument();
  });
});
