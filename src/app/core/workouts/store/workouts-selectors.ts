import { WorkoutValue } from '../workouts-schema';
import { useWorkoutsStore, WorkoutsState } from './workouts-store';
import { createSelector } from 'reselect';

export const selectAllWorkouts = () =>
  useWorkoutsStore((state) => state.workouts);

export const selectWorkoutById = (id: string | undefined | null) =>
  useWorkoutsStore(
    createSelector(
      (state: WorkoutsState) => state.workouts,
      (workouts) => workouts.find((workout) => workout.id === id),
    ),
  );

export const selectWorkoutsAsMap = () =>
  useWorkoutsStore(
    createSelector(
      (state: WorkoutsState) => state.workouts,
      (workouts) => {
        const workoutsMap = new Map<string, WorkoutValue>();
        for (const workout of workouts) {
          workoutsMap.set(workout.id, workout);
        }
        return workoutsMap;
      },
    ),
  );
