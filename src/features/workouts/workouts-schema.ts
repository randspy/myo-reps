import { z } from 'zod';

export const workoutSchema = z.object({
  name: z.string().min(1, {
    message: 'Exercise name must be at least 1 character long',
  }),
  description: z.string().optional(),
  exercises: z
    .array(
      z.object({
        id: z.string(),
        exerciseId: z.string().min(1, {
          message: 'Need to select an exercise',
        }),
        repetitions: z.number().int().min(1, {
          message: 'Need to have minimum of 1 repetition',
        }),
      }),
    )
    .optional(),
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
  repetitions: number;
};

export const defaultWorkoutExerciseValue: WorkoutExerciseValue = {
  id: '',
  exerciseId: '',
  repetitions: 1,
};

export type WorkoutValue = WorkoutFormValues & { id: string } & {
  exercises: WorkoutExerciseValue[];
};
