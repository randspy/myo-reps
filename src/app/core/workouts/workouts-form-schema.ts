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
