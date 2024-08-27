import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveExercises } from '@/app/core/exercises/exercises-selectors';
import { useSelector } from 'react-redux';
import {
  ExerciseFormValues,
  ExerciseValue,
} from '@/app/core/exercises/exercises-schema';
import { v4 as uuidv4 } from 'uuid';
import {
  addExercise,
  deleteExercise,
  hideExercise,
  setExercises,
  updateExercise,
} from '../exercises-slice';

export const useExercise = () => {
  const exercises = useAppSelector((state) => state.exercises.values);
  const activeExercises = useSelector(selectActiveExercises);

  const dispatch = useAppDispatch();

  function dispatchAdd(exercise: ExerciseFormValues) {
    const value = createExerciseFromForm(exercise, exercises.values.length);
    dispatch(addExercise(value));
  }

  function dispatchUpdate(exercise: ExerciseValue) {
    dispatch(updateExercise(exercise));
  }

  function dispatchDelete(id: string) {
    const exercise = exercises.find((exercise) => exercise.id === id);

    if (!exercise) {
      return;
    }

    if (exercise.usage.length > 0) {
      dispatch(hideExercise(exercise.id));
    } else {
      dispatch(deleteExercise(id));
    }
  }

  function dispatchSet(exercises: ExerciseValue[]) {
    dispatch(setExercises(exercises));
  }

  function dispatchAddUsage({
    exerciseId,
    userId,
  }: {
    exerciseId: string;
    userId: string;
  }) {
    const exercise: ExerciseValue | undefined = structuredClone(
      exercises.find((exercise) => exercise.id === exerciseId),
    );

    if (exercise) {
      exercise.usage.push({ id: userId });
      dispatch(updateExercise(exercise));
    }
  }

  function dispatchRemoveUsage({
    exerciseId,
    userId,
  }: {
    exerciseId: string;
    userId: string;
  }) {
    const exercise: ExerciseValue | undefined = structuredClone(
      exercises.find((exercise) => exercise.id === exerciseId),
    );

    if (exercise) {
      const usage = exercise.usage.filter((item) => item.id !== userId);

      if (!usage.length && exercise.hidden) {
        dispatch(deleteExercise(exerciseId));
      } else {
        exercise.usage = usage;

        dispatch(updateExercise(exercise));
      }
    }
  }

  return {
    exercises,
    activeExercises,
    dispatchAdd,
    dispatchUpdate,
    dispatchDelete,
    dispatchSet,
    dispatchAddUsage,
    dispatchRemoveUsage,
  };
};

function createExerciseFromForm(
  values: ExerciseFormValues,
  position: number,
): ExerciseValue {
  return {
    ...values,
    id: uuidv4(),
    position,
    usage: [],
    hidden: false,
  };
}
