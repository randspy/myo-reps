import {
  WorkoutExerciseValue,
  WorkoutFormValues,
} from '@/app/core/workouts/workouts-types';

export const defaultWorkoutFormValues: WorkoutFormValues = {
  name: '',
  description: '',
  exercises: [],
};

export const defaultWorkoutExerciseFormValue: WorkoutExerciseValue = {
  id: '',
  exerciseId: '',
  sets: 1,
};
