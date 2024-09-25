import { z } from 'zod';

export const workoutSchema = z.object({
  name: z.string().min(1, {
    message: 'Exercise name must be at least 1 character long',
  }),
  description: z.string().optional(),
  exercises: z.array(
    z.object({
      id: z.string(),
      exerciseId: z.string().min(1, {
        message: 'Need to select an exercise',
      }),
      sets: z.number().int().min(1, {
        message: 'Need to have minimum of 1 repetition',
      }),
    }),
  ),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;

export const defaultValues: WorkoutFormValues = {
  name: '',
  description: '',
  exercises: [],
};

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

export const defaultWorkoutExerciseValue: WorkoutExerciseValue = {
  id: '',
  exerciseId: '',
  sets: 1,
};
