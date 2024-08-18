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
        name: z.string().min(1, {
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
