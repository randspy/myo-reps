import { v4 as uuidv4 } from 'uuid';
import {
  WorkoutExerciseValue,
  WorkoutFormValues,
  WorkoutValue,
} from '@/app/core/workouts/workouts-schema';

export type WorkoutAction =
  | { type: 'delete'; payload: string }
  | { type: 'update'; payload: WorkoutValue }
  | null;

export const createExerciseForWorkout = () => {
  return { id: uuidv4(), sets: 1, exerciseId: '' };
};

export const createWorkoutFromForm = (
  values: WorkoutFormValues,
  position: number,
): WorkoutValue => ({
  id: uuidv4(),
  position,
  usage: [],
  hidden: false,
  ...values,
});

export const updateWorkoutPositions = (workouts: WorkoutValue[]) =>
  workouts.map((workout, idx) => ({
    ...workout,
    position: idx,
  }));

export const updateWorkoutUsageOfExercises = (
  existingWorkouts: WorkoutValue[],
  updatedWorkout: WorkoutValue,
) => {
  const existingExercises = findExercisesByWorkoutId(
    existingWorkouts,
    updatedWorkout.id,
  );

  const addedExercises = addedExercisesDiff(
    existingExercises,
    updatedWorkout.exercises,
  );

  const removedExercises = removedExercisesDiff(
    existingExercises,
    updatedWorkout.exercises,
  );

  return {
    addedExercises,
    removedExercises,
  };
};

const addedExercisesDiff = (
  existingExercises: WorkoutExerciseValue[],
  newExercises: WorkoutExerciseValue[],
) =>
  newExercises.filter(
    (newExercise) =>
      !existingExercises.find(
        (existingExercise) =>
          existingExercise.exerciseId === newExercise.exerciseId,
      ),
  );

const removedExercisesDiff = (
  existingExercises: WorkoutExerciseValue[],
  newExercises: WorkoutExerciseValue[],
) =>
  existingExercises.filter((existingExercise) => {
    return !newExercises.find((newExercise) => {
      return existingExercise.exerciseId === newExercise.exerciseId;
    });
  });

export const findExercisesByWorkoutId = (
  workouts: WorkoutValue[],
  id: string,
) => workouts.find((workout) => workout.id === id)?.exercises || [];

export const deduplicateExercisesId = (exercises: WorkoutExerciseValue[]) =>
  new Set(exercises.map((exercise) => exercise.exerciseId));

export const getNextPosition = (workouts: WorkoutValue[]) =>
  workouts.length ? workouts[workouts.length - 1].position + 1 : 0;

export const canStartWorkout = (workout: WorkoutValue) =>
  workout.exercises.length > 0;

export const addUsageToWorkout = (
  workouts: WorkoutValue[],
  workoutId: string,
  userId: string,
) => {
  const workout = workouts.find((workout) => workout.id === workoutId);

  if (workout) {
    return {
      ...workout,
      usage: [...workout.usage, { id: userId }],
    };
  }
  return null;
};

export const removeUsageFromWorkout = (
  workouts: WorkoutValue[],
  workoutId: string,
  userId: string,
): WorkoutAction => {
  const workout = workouts.find((workout) => workout.id === workoutId);
  if (workout) {
    const usage = workout.usage.filter((item) => item.id !== userId);

    if (!usage.length && workout.hidden) {
      return { type: 'delete', payload: workoutId };
    } else {
      return { type: 'update', payload: { ...workout, usage: usage } };
    }
  }
  return null;
};

export const removeWorkoutFromUserView = (
  workouts: WorkoutValue[],
  workoutId: string,
): WorkoutAction => {
  const workout = workouts.find((workout) => workout.id === workoutId);
  if (workout) {
    if (workout.usage.length) {
      return { type: 'update', payload: { ...workout, hidden: true } };
    } else {
      return { type: 'delete', payload: workoutId };
    }
  }
  return null;
};
