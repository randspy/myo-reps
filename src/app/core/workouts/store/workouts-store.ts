import { create } from 'zustand';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { devtools } from 'zustand/middleware';

export interface WorkoutsState {
  workouts: WorkoutValue[];
  restoreWorkouts: (workouts: WorkoutValue[]) => void;
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
    restoreWorkouts: (workouts) => {
      set({ workouts: workouts.toSorted((a, b) => a.position - b.position) });
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
