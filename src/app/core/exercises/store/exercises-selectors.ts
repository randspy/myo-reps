import { createSelector } from 'reselect';
import { RootState } from '@/store/store';

const selectAllExercises = (state: RootState) => state.exercises.values;

export const selectActiveExercises = createSelector(
  [selectAllExercises],
  (exercises) => exercises.filter((exercise) => !exercise.hidden),
);

export const selectExerciseById = (id: string | undefined) =>
  createSelector([selectAllExercises], (exercises) =>
    exercises.find((exercise) => exercise.id === id),
  );

export const selectExercisesByWorkoutIdAsMap = (
  workoutId: string | undefined | null,
) =>
  createSelector([selectAllExercises], (exercises) => {
    const exercisesMap = new Map();
    for (const exercise of exercises) {
      for (const usage of exercise.usage) {
        if (usage.id === workoutId) {
          exercisesMap.set(exercise.id, exercise);
        }
      }
    }
    return exercisesMap;
  });

export const selectExercisesByWorkoutId = (
  workoutId: string | undefined | null,
) =>
  createSelector([selectAllExercises], (exercises) =>
    exercises.filter((exercise) =>
      exercise.usage.some((usage) => usage.id === workoutId),
    ),
  );
