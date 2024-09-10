import { v4 as uuidv4 } from 'uuid';
import {
  ExerciseFormValues,
  ExerciseValue,
} from '@/app/core/exercises/exercises-schema';

export type ExerciseAction =
  | { type: 'delete'; payload: string }
  | { type: 'update'; payload: ExerciseValue }
  | null;

export const createExerciseFromForm = (
  values: ExerciseFormValues,
  position: number,
): ExerciseValue => {
  return {
    ...values,
    id: uuidv4(),
    position,
    usage: [],
    hidden: false,
  };
};

export const updateExercisePositions = (exercises: ExerciseValue[]) => {
  return exercises.map((exercise, idx) => ({
    ...exercise,
    position: idx,
  }));
};

export const removeExerciseFromUserView = (
  id: string,
  exercises: ExerciseValue[],
): ExerciseAction => {
  const exercise = exercises.find((exercise) => exercise.id === id);

  if (!exercise) {
    return null;
  }

  if (exercise.usage.length > 0) {
    return { type: 'update', payload: { ...exercise, hidden: true } };
  } else {
    return { type: 'delete', payload: id };
  }
};

export const addUsageToExercise = (
  exercises: ExerciseValue[],
  exerciseId: string,
  userId: string,
) => {
  const exercise: ExerciseValue | undefined = structuredClone(
    exercises.find((exercise) => exercise.id === exerciseId),
  );

  if (exercise) {
    exercise.usage.push({ id: userId });
  }

  return exercise;
};

export const removeUsageFromExercise = (
  exercises: ExerciseValue[],
  exerciseId: string,
  userId: string,
): ExerciseAction => {
  const exercise: ExerciseValue | undefined = structuredClone(
    exercises.find((exercise) => exercise.id === exerciseId),
  );

  if (!exercise) {
    return null;
  }

  const usage = exercise.usage.filter((item) => item.id !== userId);

  if (!usage.length && exercise.hidden) {
    return { type: 'delete', payload: exerciseId };
  } else {
    exercise.usage = usage;
    return { type: 'update', payload: exercise };
  }
};
