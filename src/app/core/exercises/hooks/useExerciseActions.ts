import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { ExerciseDbService } from '@/app/core/exercises/services/exercise-db-service';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';

export const useExerciseActions = () => {
  const { setExercises, addExercise, deleteExercise, updateExercise } =
    useExercisesStore();

  const setExercisesWithPersistence = async (exercises: ExerciseValue[]) => {
    await ExerciseDbService.bulkPut(exercises);
    setExercises(exercises);
  };

  const addExerciseWithPersistence = async (exercise: ExerciseValue) => {
    await ExerciseDbService.add(exercise);
    addExercise(exercise);
  };

  const deleteExerciseWithPersistence = async (id: string) => {
    await ExerciseDbService.delete(id);
    deleteExercise(id);
  };

  const updateExerciseWithPersistence = async (exercise: ExerciseValue) => {
    await ExerciseDbService.update(exercise);
    updateExercise(exercise);
  };

  return {
    setExercises: setExercisesWithPersistence,
    addExercise: addExerciseWithPersistence,
    deleteExercise: deleteExerciseWithPersistence,
    updateExercise: updateExerciseWithPersistence,
  };
};
