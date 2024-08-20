import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from '@/features/workouts/workouts-slice';
import { WorkoutList } from './WorkoutList';
import { WorkoutValue } from '@/features/workouts/workouts-schema';

const initialState = {
  workouts: {
    values: [
      { id: '1', name: 'Upper body', description: 'Upper body description' },
      { id: '2', name: 'Lower body', description: 'Lower body description' },
    ],
  },
};

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
  preloadedState: initialState,
});

const editWorkout = vi.fn();
const deleteWorkout = vi.fn();

vi.mock('@/app/workouts/EditWorkoutDialog', () => ({
  EditWorkoutDialog: ({ workout }: { workout: WorkoutValue }) => {
    editWorkout(workout);
    return <div></div>;
  },
}));

vi.mock('@/app/workouts/DeleteWorkoutDialog', () => ({
  DeleteWorkoutDialog: ({ workout }: { workout: WorkoutValue }) => {
    deleteWorkout(workout);
    return <div></div>;
  },
}));

describe('Workout list', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <WorkoutList />
      </Provider>,
    );
  });

  it('renders the list of workouts', () => {
    initialState.workouts.values.forEach((workouts) => {
      expect(screen.getByText(workouts.name)).toBeInTheDocument();
    });
  });

  it('pass through workouts to child components', async () => {
    expect(editWorkout).toHaveBeenCalledWith(initialState.workouts.values[0]);
    expect(deleteWorkout).toHaveBeenCalledWith(initialState.workouts.values[0]);
  });
});
