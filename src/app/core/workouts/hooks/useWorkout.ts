import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import {
  WorkoutFormValues,
  WorkoutValue,
} from '@/app/core/workouts/workouts-schema';
import { useWorkoutActions } from '@/app/core/workouts/hooks/useWorkoutActions';
import {
  createWorkoutFromForm,
  deduplicateExercisesId,
  findExercisesByWorkoutId,
  getNextPosition,
  updateWorkoutPositions,
  updateWorkoutUsageOfExercises,
} from '@/app/core/workouts/domain/workout.domain';
import { selectAllWorkouts } from '@/app/core/workouts/store/workouts-selectors';

export const useWorkout = () => {
  const workouts = selectAllWorkouts();
  const { dispatchAddUsage, dispatchRemoveUsage } = useExercise();
  const { addWorkout, updateWorkout, deleteWorkout, setWorkouts } =
    useWorkoutActions();

  async function dispatchAdd(value: WorkoutFormValues) {
    const workout = createWorkoutFromForm(value, getNextPosition(workouts));
    const distinctExerciseIds = deduplicateExercisesId(workout.exercises);

    await addWorkout(workout);

    for (const exerciseId of distinctExerciseIds) {
      dispatchAddUsage({ exerciseId: exerciseId, userId: workout.id });
    }
  }

  async function dispatchUpdate(updatedWorkout: WorkoutValue) {
    await updateWorkout(updatedWorkout);

    const { addedExercises, removedExercises } = updateWorkoutUsageOfExercises(
      workouts,
      updatedWorkout,
    );

    for (const exercise of addedExercises) {
      await dispatchAddUsage({
        exerciseId: exercise.exerciseId,
        userId: updatedWorkout.id,
      });
    }

    for (const exercise of removedExercises) {
      await dispatchRemoveUsage({
        exerciseId: exercise.exerciseId,
        userId: updatedWorkout.id,
      });
    }
  }

  async function dispatchDelete(id: string) {
    await deleteWorkout(id);

    const exercises = findExercisesByWorkoutId(workouts, id);

    for (const exercise of exercises) {
      await dispatchRemoveUsage({
        exerciseId: exercise.exerciseId,
        userId: id,
      });
    }
  }

  async function dispatchSet(workouts: WorkoutValue[]) {
    await setWorkouts(updateWorkoutPositions(workouts));
  }

  return {
    workouts,
    dispatchAdd,
    dispatchUpdate,
    dispatchDelete,
    dispatchSet,
  };
};
