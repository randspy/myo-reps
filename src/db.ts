import Dexie, { type EntityTable } from 'dexie';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { WorkoutValue } from '@/app/core/workouts/workouts-types';
import { useExercisesStore } from './app/core/exercises/store/exercises-store';
import { useWorkoutsStore } from './app/core/workouts/store/workouts-store';
import { SessionValue } from './app/features/sessions/sessions-types';
import { useSessionsStore } from './app/features/sessions/store/sessions-store';

const db = new Dexie('myo-reps') as Dexie & {
  exercises: EntityTable<ExerciseValue, 'id'>;
  workouts: EntityTable<WorkoutValue, 'id'>;
  sessions: EntityTable<SessionValue, 'id'>;
};

db.version(1).stores({
  exercises: 'id',
  workouts: 'id',
  sessions: 'id',
});

async function recreateDB() {
  await db.delete();
  await db.open();
}

async function restoreFromDB() {
  const exercises = await db.exercises.toArray();
  const workouts = await db.workouts.toArray();
  const sessions = await db.sessions.toArray();

  useExercisesStore.getState().restoreExercises(exercises);
  useWorkoutsStore.getState().restoreWorkouts(workouts);
  useSessionsStore.getState().restoreSessions(sessions);
}

restoreFromDB();

export { db, recreateDB, restoreFromDB };
