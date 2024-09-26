import { create } from 'zustand';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { devtools } from 'zustand/middleware';

export interface ExercisesState {
  exercises: ExerciseValue[];
  restoreExercises: (exercises: ExerciseValue[]) => void;
  setExercises: (exercises: ExerciseValue[]) => void;
  addExercise: (exercise: ExerciseValue) => void;
  deleteExercise: (id: string) => void;
  updateExercise: (exercise: ExerciseValue) => void;
}

export const useExercisesStore = create<
  ExercisesState,
  [['zustand/devtools', never]]
>(
  devtools((set) => ({
    exercises: [],
    restoreExercises: (exercises) => {
      set({
        exercises: exercises.toSorted((a, b) => a.position - b.position),
      });
    },
    setExercises: (exercises) => {
      set({ exercises });
    },
    addExercise: (exercise) => {
      set((state) => ({ exercises: [...state.exercises, exercise] }));
    },
    deleteExercise: (id) => {
      set((state) => ({
        exercises: state.exercises.filter((exercise) => exercise.id !== id),
      }));
    },
    updateExercise: (updatedExercise) => {
      set((state) => ({
        exercises: state.exercises.map((exercise) =>
          exercise.id === updatedExercise.id ? updatedExercise : exercise,
        ),
      }));
    },
  })),
);
