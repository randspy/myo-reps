import { db } from '@/db';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';

interface WorkoutState {
  values: WorkoutValue[];
}

const initialState: WorkoutState = {
  values: [],
};

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    restoreWorkouts(state, action: PayloadAction<WorkoutValue[]>) {
      state.values = action.payload.toSorted((a, b) => a.position - b.position);
    },
    setWorkouts(state, action: PayloadAction<WorkoutValue[]>) {
      state.values = action.payload;
    },
    addWorkout(state, action: PayloadAction<WorkoutValue>) {
      state.values.push(action.payload);
    },
    deleteWorkout(state, action: PayloadAction<string>) {
      state.values = state.values.filter(
        (exercise) => exercise.id !== action.payload,
      );
    },
    updateWorkout(state, action: PayloadAction<WorkoutValue>) {
      const index = state.values.findIndex(
        (exercise) => exercise.id === action.payload.id,
      );
      state.values[index] = action.payload;
    },
  },
});

export const {
  addWorkout,
  deleteWorkout,
  updateWorkout,
  setWorkouts,
  restoreWorkouts,
} = workoutsSlice.actions;
export default workoutsSlice.reducer;

export const workoutListeners = [
  {
    actionCreator: setWorkouts,
    effect: (action: PayloadAction<WorkoutValue[]>) => {
      db.workouts.bulkPut(action.payload);
    },
  },
  {
    actionCreator: addWorkout,
    effect: (action: PayloadAction<WorkoutValue>) => {
      db.workouts.add(action.payload);
    },
  },
  {
    actionCreator: deleteWorkout,
    effect: (action: PayloadAction<string>) => {
      db.workouts.delete(action.payload);
    },
  },
  {
    actionCreator: updateWorkout,
    effect: (action: PayloadAction<WorkoutValue>) => {
      db.workouts.update(action.payload.id, action.payload);
    },
  },
];
