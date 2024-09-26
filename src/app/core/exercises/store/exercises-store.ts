import { create } from 'zustand';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { devtools } from 'zustand/middleware';
import { db } from '@/db';

export interface ExercisesState {
  exercises: ExerciseValue[];
  isInitialized: boolean;
  restoreExercises: () => Promise<void>;
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
    isInitialized: false,
    restoreExercises: async () => {
      if (!useExercisesStore.getState().isInitialized) {
        const exercises = await db.exercises.toArray();
        set({
          exercises: exercises.toSorted((a, b) => a.position - b.position),
          isInitialized: true,
        });
      }
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

useExercisesStore.getState().restoreExercises();
