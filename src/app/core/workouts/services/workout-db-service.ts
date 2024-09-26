import { db } from '@/db';
import { WorkoutValue } from '@/app/core/workouts/workouts-types';

export const WorkoutDbService = {
  bulkPut: async (workouts: WorkoutValue[]) => {
    await db.workouts.bulkPut(workouts);
  },

  add: async (workout: WorkoutValue) => {
    await db.workouts.add(workout);
  },

  delete: async (id: string) => {
    await db.workouts.delete(id);
  },

  update: async (workout: WorkoutValue) => {
    await db.workouts.update(workout.id, workout);
  },
};
