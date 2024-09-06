import Dexie, { type EntityTable } from 'dexie';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { restoreExercises } from './app/core/exercises/store/exercises-slice';
import { restoreWorkouts } from './app/core/workouts/workouts-slice';

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

async function restoreFromDB() {
  const exercises = await db.exercises.toArray();
  const workouts = await db.workouts.toArray();

  return [restoreExercises(exercises), restoreWorkouts(workouts)];
}

export { db, recreateDB, restoreFromDB };
