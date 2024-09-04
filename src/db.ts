import Dexie, { type EntityTable } from 'dexie';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';

const db = new Dexie('myo-reps') as Dexie & {
  exercises: EntityTable<ExerciseValue, 'id'>;
  workouts: EntityTable<WorkoutValue, 'id'>;
};

db.version(1).stores({
  exercises: 'id',
  workouts: 'id',
});

async function recreateDB() {
  await db.delete();
  await db.open();
}

export { db, recreateDB };
