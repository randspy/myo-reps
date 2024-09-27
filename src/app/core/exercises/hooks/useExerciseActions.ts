import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { db } from '@/db';

export const useExerciseActions = () => {
  const { setExercises, addExercise, deleteExercise, updateExercise } =
    useExercisesStore();

  const setExercisesWithPersistence = async (exercises: ExerciseValue[]) => {
    await db.exercises.bulkPut(exercises);
    setExercises(exercises);
  };

  const addExerciseWithPersistence = async (exercise: ExerciseValue) => {
    await db.exercises.add(exercise);
    addExercise(exercise);
  };

  const deleteExerciseWithPersistence = async (id: string) => {
    await db.exercises.delete(id);
    deleteExercise(id);
  };

  const updateExerciseWithPersistence = async (exercise: ExerciseValue) => {
    await db.exercises.update(exercise.id, exercise);
    updateExercise(exercise);
  };

  return {
    setExercises: setExercisesWithPersistence,
    addExercise: addExerciseWithPersistence,
    deleteExercise: deleteExerciseWithPersistence,
    updateExercise: updateExerciseWithPersistence,
  };
};
