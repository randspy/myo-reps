import { ExercisesState, useExercisesStore } from './exercises-store';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { createSelector } from 'reselect';

export const selectAllExercises = () =>
  useExercisesStore((state) => state.exercises);

export const selectActiveExercises = () =>
  useExercisesStore(
    createSelector(
      (state: ExercisesState) => state.exercises,
      (exercises) =>
        exercises.filter((exercise: ExerciseValue) => !exercise.hidden),
    ),
  );

export const selectExerciseById = (id: string | undefined) =>
  useExercisesStore(
    createSelector(
      (state: ExercisesState) => state.exercises,
      (exercises) =>
        exercises.find((exercise: ExerciseValue) => exercise.id === id),
    ),
  );

export const selectExerciseByWorkoutIdAsMap = (
  workoutId: string | undefined | null,
) =>
  useExercisesStore(
    createSelector(
      (state: ExercisesState) => state.exercises,
      (exercises) => {
        const exercisesMap = new Map<string, ExerciseValue>();
        for (const exercise of exercises) {
          for (const usage of exercise.usage) {
            if (usage.id === workoutId) {
              exercisesMap.set(exercise.id, exercise);
            }
          }
        }
        return exercisesMap;
      },
    ),
  );

export const selectExercisesByWorkoutId = (
  workoutId: string | undefined | null,
) =>
  useExercisesStore(
    createSelector(
      (state: ExercisesState) => state.exercises,
      (exercises) => {
        return exercises.filter((exercise: ExerciseValue) =>
          exercise.usage.some((usage) => usage.id === workoutId),
        );
      },
    ),
  );
