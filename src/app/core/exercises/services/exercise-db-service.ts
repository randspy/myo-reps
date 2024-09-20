import { db } from '@/db';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';

export const ExerciseDbService = {
  bulkPut: async (exercises: ExerciseValue[]) => {
    await db.exercises.bulkPut(exercises);
  },

  add: async (exercise: ExerciseValue) => {
    await db.exercises.add(exercise);
  },

  delete: async (id: string) => {
    await db.exercises.delete(id);
  },

  update: async (exercise: ExerciseValue) => {
    await db.exercises.update(exercise.id, exercise);
  },
};
