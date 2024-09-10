import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectActiveExercises } from '@/app/core/exercises/store/exercises-selectors';
import { useSelector } from 'react-redux';
import {
  ExerciseFormValues,
  ExerciseValue,
} from '@/app/core/exercises/exercises-schema';
import {
  addExercise,
  deleteExercise,
  setExercises,
  updateExercise,
} from '@/app/core/exercises/store/exercises-slice';
import {
  addUsageToExercise,
  createExerciseFromForm,
  removeUsageFromExercise,
  removeExerciseFromUserView,
  updateExercisePositions,
  ExerciseAction,
} from '@/app/core/exercises/domain/exercises.domain';

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
    const action: ExerciseAction = removeExerciseFromUserView(id, exercises);

    if (action) {
      if (action.type === 'update') {
        dispatch(updateExercise(action.payload));
      } else if (action.type === 'delete') {
        dispatch(deleteExercise(action.payload));
      }
    }
  }

  function dispatchSet(exercises: ExerciseValue[]) {
    dispatch(setExercises(updateExercisePositions(exercises)));
  }

  function dispatchAddUsage({
    exerciseId,
    userId,
  }: {
    exerciseId: string;
    userId: string;
  }) {
    const exercise = addUsageToExercise(exercises, exerciseId, userId);

    if (exercise) {
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
    const action: ExerciseAction = removeUsageFromExercise(
      exercises,
      exerciseId,
      userId,
    );

    if (action) {
      if (action.type === 'update') {
        dispatch(updateExercise(action.payload));
      } else if (action.type === 'delete') {
        dispatch(deleteExercise(action.payload));
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
