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
import { v4 as uuidv4 } from 'uuid';

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

  function dispatchSet(workouts: WorkoutValue[]) {
    dispatch(setWorkouts(updateWorkoutPositions(workouts)));
  }

  return {
    workouts,
    dispatchAdd,
    dispatchUpdate,
    dispatchDelete,
    dispatchSet,
  };
};

function createWorkoutFromForm(
  values: WorkoutFormValues,
  position: number,
): WorkoutValue {
  return {
    id: uuidv4(),
    position,
    ...values,
  };
}

function updateWorkoutPositions(workouts: WorkoutValue[]) {
  return workouts.map((workout, idx) => ({
    ...workout,
    position: idx,
  }));
}
