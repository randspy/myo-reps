import { useExercise } from '@/features/exercises/hooks/useExercise';
import {
  WorkoutFormValues,
  WorkoutValue,
} from '@/features/workouts/workouts-schema';
import {
  addWorkout,
  createWorkoutFromForm,
  deleteWorkout,
  updateWorkout,
} from '@/features/workouts/workouts-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const useWorkout = () => {
  const workouts = useAppSelector((state) => state.workouts.values);
  const { dispatchAddUsage, dispatchRemoveUsage } = useExercise();

  const dispatch = useAppDispatch();

  function dispatchAdd(value: WorkoutFormValues) {
    const workout = createWorkoutFromForm(value, workouts.length);
    dispatch(addWorkout(workout));

    const distinctExercises = new Set(
      workout.exercises.map((e) => e.exerciseId),
    );

    for (const exerciseId of distinctExercises) {
      dispatchAddUsage({ exerciseId: exerciseId, userId: workout.id });
    }
  }

  function dispatchUpdate(updatedWorkout: WorkoutValue) {
    dispatch(updateWorkout(updatedWorkout));

    const exercisesFromStore =
      workouts.find((workout) => workout.id === updatedWorkout.id)?.exercises ||
      [];

    const addedExercises = updatedWorkout.exercises.filter(
      (exerciseFromValue) =>
        !exercisesFromStore.find(
          (exercise) => exercise.exerciseId === exerciseFromValue.exerciseId,
        ),
    );

    const removedExercises = exercisesFromStore.filter((exerciseFromStore) => {
      return !updatedWorkout.exercises.find((exerciseFromUpdatedWorkout) => {
        return (
          exerciseFromStore.exerciseId === exerciseFromUpdatedWorkout.exerciseId
        );
      });
    });

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

    const exercises =
      workouts.find((workout) => workout.id === id)?.exercises || [];

    for (const exercise of exercises) {
      dispatchRemoveUsage({ exerciseId: exercise.exerciseId, userId: id });
    }
  }

  return {
    workouts,
    dispatchAdd,
    dispatchUpdate,
    dispatchDelete,
  };
};
