import { z } from 'zod';
import { workoutSchema } from './workouts-form-schema';

export type WorkoutFormValues = z.infer<typeof workoutSchema>;

export type WorkoutExerciseValue = {
  id: string;
  exerciseId: string;
  sets: number;
};

export type WorkoutValue = WorkoutFormValues & {
  id: string;
  position: number;
  usage: WorkoutUsage[];
  hidden: boolean;
};

export type WorkoutUsage = {
  id: string;
};

export { workoutSchema };
