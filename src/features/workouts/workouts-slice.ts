import { db } from '@/db';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutFormValues, WorkoutValue } from './workouts-schema';

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
    setWorkouts(state, action: PayloadAction<WorkoutValue[]>) {
      state.values = action.payload;
    },
    addWorkout(state, action: PayloadAction<WorkoutFormValues>) {
      const value = { ...action.payload, id: uuidv4() };
      state.values.push(value);
      db.workouts.add(value);
    },
    deleteWorkout(state, action: PayloadAction<string>) {
      state.values = state.values.filter(
        (exercise) => exercise.id !== action.payload,
      );
      db.workouts.delete(action.payload);
    },
    updateWorkout(state, action: PayloadAction<WorkoutValue>) {
      const index = state.values.findIndex(
        (exercise) => exercise.id === action.payload.id,
      );
      state.values[index] = action.payload;
      db.workouts.update(action.payload.id, action.payload);
    },
  },
});

export const { addWorkout, deleteWorkout, updateWorkout, setWorkouts } =
  workoutsSlice.actions;
export default workoutsSlice.reducer;
