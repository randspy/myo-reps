import { create } from 'zustand';
import { WorkoutValue } from '@/app/core/workouts/workouts-types';
import { devtools } from 'zustand/middleware';
import { db } from '@/db';

export interface WorkoutsState {
  workouts: WorkoutValue[];
  isInitialized: boolean;
  restoreWorkouts: () => Promise<void>;
  setWorkouts: (workouts: WorkoutValue[]) => void;
  addWorkout: (workout: WorkoutValue) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (workout: WorkoutValue) => void;
}

export const useWorkoutsStore = create<
  WorkoutsState,
  [['zustand/devtools', never]]
>(
  devtools((set) => ({
    workouts: [],
    isInitialized: false,
    restoreWorkouts: async () => {
      if (!useWorkoutsStore.getState().isInitialized) {
        const workouts = await db.workouts.toArray();
        set({
          workouts: workouts.toSorted((a, b) => a.position - b.position),
          isInitialized: true,
        });
      }
    },
    setWorkouts: (workouts) => {
      set({ workouts });
    },
    addWorkout: (workout) => {
      set((state) => ({ workouts: [...state.workouts, workout] }));
    },
    deleteWorkout: (id) => {
      set((state) => ({
        workouts: state.workouts.filter((workout) => workout.id !== id),
      }));
    },
    updateWorkout: (updatedWorkout) => {
      set((state) => ({
        workouts: state.workouts.map((workout) =>
          workout.id === updatedWorkout.id ? updatedWorkout : workout,
        ),
      }));
    },
  })),
);

useWorkoutsStore.getState().restoreWorkouts();
