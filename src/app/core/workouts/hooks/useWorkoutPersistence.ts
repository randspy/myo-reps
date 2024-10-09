import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { WorkoutValue } from '@/app/core/workouts/workouts-types';
import { db } from '@/db';

export const useWorkoutPersistence = () => {
  const { setWorkouts, addWorkout, deleteWorkout, updateWorkout } =
    useWorkoutsStore();

  const setWorkoutsWithPersistence = async (workouts: WorkoutValue[]) => {
    await db.workouts.bulkPut(workouts);
    setWorkouts(workouts);
  };

  const addWorkoutWithPersistence = async (workout: WorkoutValue) => {
    await db.workouts.add(workout);
    addWorkout(workout);
  };

  const deleteWorkoutWithPersistence = async (id: string) => {
    await db.workouts.delete(id);
    deleteWorkout(id);
  };

  const updateWorkoutWithPersistence = async (workout: WorkoutValue) => {
    await db.workouts.update(workout.id, workout);
    updateWorkout(workout);
  };

  return {
    setWorkouts: setWorkoutsWithPersistence,
    addWorkout: addWorkoutWithPersistence,
    deleteWorkout: deleteWorkoutWithPersistence,
    updateWorkout: updateWorkoutWithPersistence,
  };
};
