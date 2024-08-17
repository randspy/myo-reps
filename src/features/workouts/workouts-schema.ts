import { z } from 'zod';

export const workoutSchema = z.object({
  name: z.string().min(1, {
    message: 'Exercise name must be at least 1 character long',
  }),
  description: z.string().optional(),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;

export const defaultValues: WorkoutFormValues = {
  name: '',
  description: '',
};
