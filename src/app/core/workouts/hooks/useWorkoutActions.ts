import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { WorkoutDbService } from '@/app/core/workouts/services/workout-db-service';
import { WorkoutValue } from '@/app/core/workouts/workouts-types';

export const useWorkoutActions = () => {
  const { setWorkouts, addWorkout, deleteWorkout, updateWorkout } =
    useWorkoutsStore();

  const setWorkoutsWithPersistence = async (workouts: WorkoutValue[]) => {
    await WorkoutDbService.bulkPut(workouts);
    setWorkouts(workouts);
  };

  const addWorkoutWithPersistence = async (workout: WorkoutValue) => {
    await WorkoutDbService.add(workout);
    addWorkout(workout);
  };

  const deleteWorkoutWithPersistence = async (id: string) => {
    await WorkoutDbService.delete(id);
    deleteWorkout(id);
  };

  const updateWorkoutWithPersistence = async (workout: WorkoutValue) => {
    await WorkoutDbService.update(workout);
    updateWorkout(workout);
  };

  return {
    setWorkouts: setWorkoutsWithPersistence,
    addWorkout: addWorkoutWithPersistence,
    deleteWorkout: deleteWorkoutWithPersistence,
    updateWorkout: updateWorkoutWithPersistence,
  };
};
