import Dexie, { type EntityTable } from 'dexie';
import { ExerciseValue } from './features/exercises/exercises-schema';
import { WorkoutValue } from './features/workouts/workouts-schema';

const db = new Dexie('myo-reps') as Dexie & {
  exercises: EntityTable<ExerciseValue, 'id'>;
  workouts: EntityTable<WorkoutValue, 'id'>;
};

db.version(1).stores({
  exercises: 'id',
  workouts: 'id',
});

export { db };
