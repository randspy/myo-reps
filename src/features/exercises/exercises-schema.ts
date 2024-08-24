import { z } from 'zod';

export const exerciseSchema = z.object({
  name: z.string().min(1, {
    message: 'Exercise name must be at least 1 character long',
  }),
  description: z.string().optional(),
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;

export type ExerciseUsage = {
  id: string;
};

export type ExerciseValue = ExerciseFormValues & {
  id: string;
  position: number;
  usage: ExerciseUsage[];
};

export const defaultValues: ExerciseFormValues = {
  name: '',
  description: '',
};
