import { z } from 'zod';
import { exerciseSchema } from './exercises-form-schema';

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;

export type ExerciseUsage = {
  id: string;
};

export type ExerciseValue = ExerciseFormValues & {
  id: string;
  position: number;
  usage: ExerciseUsage[];
  hidden: boolean;
};

export { exerciseSchema };
