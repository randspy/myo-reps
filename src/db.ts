import Dexie, { type EntityTable } from 'dexie';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { WorkoutValue } from '@/app/core/workouts/workouts-types';
import { SessionValue } from '@/app/features/sessions/sessions-types';

export const db = new Dexie('myo-reps') as Dexie & {
  exercises: EntityTable<ExerciseValue, 'id'>;
  workouts: EntityTable<WorkoutValue, 'id'>;
  sessions: EntityTable<SessionValue, 'id'>;
};

db.version(1).stores({
  exercises: 'id',
  workouts: 'id',
  sessions: 'id',
});

export async function recreateDB() {
  await db.delete();
  await db.open();
}
