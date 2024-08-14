import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Exercise name must be at least 1 character long',
  }),
  description: z.string().optional(),
});

export type NewExerciseFormValues = z.infer<typeof formSchema>;
export type ExerciseFormValues = NewExerciseFormValues & { id: string };

export const defaultValues: NewExerciseFormValues = {
  name: '',
  description: '',
};
