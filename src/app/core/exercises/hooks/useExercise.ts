import {
  ExerciseFormValues,
  ExerciseValue,
} from '@/app/core/exercises/exercises-types';
import { useExerciseActions } from '@/app/core/exercises/hooks/useExerciseActions';
import {
  addUsageToExercise,
  createExerciseFromForm,
  removeUsageFromExercise,
  removeExerciseFromUserView,
  updateExercisePositions,
  ExerciseAction,
  getNextPosition,
} from '@/app/core/exercises/domain/exercises-domain';
import { selectAllExercises } from '@/app/core/exercises/store/exercises-selectors';

export const useExercise = () => {
  const exercises = selectAllExercises();
  const { addExercise, updateExercise, deleteExercise, setExercises } =
    useExerciseActions();

  async function dispatchAddExercise(exercise: ExerciseFormValues) {
    const value = createExerciseFromForm(exercise, getNextPosition(exercises));
    await addExercise(value);
  }

  async function dispatchUpdateExercise(exercise: ExerciseValue) {
    await updateExercise(exercise);
  }

  async function dispatchDeleteExercise(id: string) {
    const action: ExerciseAction = removeExerciseFromUserView(id, exercises);

    if (action) {
      if (action.type === 'update') {
        await updateExercise(action.payload);
      } else if (action.type === 'delete') {
        await deleteExercise(action.payload);
      }
    }
  }

  async function dispatchSetExercises(exercises: ExerciseValue[]) {
    await setExercises(updateExercisePositions(exercises));
  }

  async function dispatchAddUsageExercise({
    exerciseId,
    userId,
  }: {
    exerciseId: string;
    userId: string;
  }) {
    const exercise = addUsageToExercise(exercises, exerciseId, userId);

    if (exercise) {
      await updateExercise(exercise);
    }
  }

  async function dispatchRemoveUsageExercise({
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
        await updateExercise(action.payload);
      } else if (action.type === 'delete') {
        await deleteExercise(action.payload);
      }
    }
  }

  return {
    dispatchAddExercise,
    dispatchUpdateExercise,
    dispatchDeleteExercise,
    dispatchSetExercises,
    dispatchAddUsageExercise,
    dispatchRemoveUsageExercise,
  };
};
