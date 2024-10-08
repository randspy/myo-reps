import { z } from 'zod';

export const exerciseSchema = z.object({
  name: z.string().min(1, {
    message: 'Exercise name must be at least 1 character long',
  }),
  description: z.string().optional(),
});
