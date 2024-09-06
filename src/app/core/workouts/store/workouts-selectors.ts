import { createSelector } from 'reselect';
import { RootState } from '@/store/store';

const selectAllWorkouts = (state: RootState) => state.workouts.values;

export const selectWorkoutById = (id: string | undefined | null) =>
  createSelector([selectAllWorkouts], (workouts) =>
    workouts.find((workout) => workout.id === id),
  );
