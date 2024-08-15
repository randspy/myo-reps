import Dexie, { type EntityTable } from 'dexie';
import { ExerciseValue } from './features/exercises/exercises-schema';

const db = new Dexie('myo-reps') as Dexie & {
  exercises: EntityTable<ExerciseValue, 'id'>;
};

db.version(1).stores({
  exercises: 'id, name, description',
});

export { db };
