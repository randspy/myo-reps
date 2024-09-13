import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import {
  WorkoutFormValues,
  WorkoutValue,
} from '@/app/core/workouts/workouts-schema';
import {
  addWorkout,
  deleteWorkout,
  setWorkouts,
  updateWorkout,
} from '@/app/core/workouts/store/workouts-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createExerciseForWorkout,
  createWorkoutFromForm,
  deduplicateExercisesId,
  findExercisesByWorkoutId,
  getNextPosition,
  updateWorkoutPositions,
  updateWorkoutUsageOfExercises,
} from '@/app/core/workouts/domain/workout.domain';

export const useWorkout = () => {
  const workouts = useAppSelector((state) => state.workouts.values);
  const { dispatchAddUsage, dispatchRemoveUsage } = useExercise();

  const dispatch = useAppDispatch();

  function dispatchAdd(value: WorkoutFormValues) {
    const workout = createWorkoutFromForm(value, getNextPosition(workouts));
    const distinctExerciseIds = deduplicateExercisesId(workout.exercises);

    dispatch(addWorkout(workout));

    for (const exerciseId of distinctExerciseIds) {
      dispatchAddUsage({ exerciseId: exerciseId, userId: workout.id });
    }
  }

  function dispatchUpdate(updatedWorkout: WorkoutValue) {
    dispatch(updateWorkout(updatedWorkout));

    const { addedExercises, removedExercises } = updateWorkoutUsageOfExercises(
      workouts,
      updatedWorkout,
    );

    for (const exercise of addedExercises) {
      dispatchAddUsage({
        exerciseId: exercise.exerciseId,
        userId: updatedWorkout.id,
      });
    }

    for (const exercise of removedExercises) {
      dispatchRemoveUsage({
        exerciseId: exercise.exerciseId,
        userId: updatedWorkout.id,
      });
    }
  }

  function dispatchDelete(id: string) {
    dispatch(deleteWorkout(id));

    const exercises = findExercisesByWorkoutId(workouts, id);

    for (const exercise of exercises) {
      dispatchRemoveUsage({ exerciseId: exercise.exerciseId, userId: id });
    }
  }

  function dispatchSet(workouts: WorkoutValue[]) {
    dispatch(setWorkouts(updateWorkoutPositions(workouts)));
  }

  return {
    workouts,
    dispatchAdd,
    dispatchUpdate,
    dispatchDelete,
    dispatchSet,
    createExerciseForWorkout,
  };
};
