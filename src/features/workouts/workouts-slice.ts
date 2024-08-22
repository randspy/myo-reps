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
    restoreWorkouts(state, action: PayloadAction<WorkoutValue[]>) {
      state.values = action.payload.toSorted((a, b) => a.position - b.position);
    },
    setWorkouts(state, action: PayloadAction<WorkoutValue[]>) {
      const values = updateWorkoutPositions(action.payload);
      state.values = values;
      db.workouts.bulkPut(values);
    },
    addWorkout(state, action: PayloadAction<WorkoutFormValues>) {
      const value = createWorkoutFromForm(action.payload, state.values.length);
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

export const {
  addWorkout,
  deleteWorkout,
  updateWorkout,
  setWorkouts,
  restoreWorkouts,
} = workoutsSlice.actions;
export default workoutsSlice.reducer;

function updateWorkoutPositions(workouts: WorkoutValue[]) {
  return workouts.map((workout, idx) => ({
    ...workout,
    position: idx,
  }));
}

function createWorkoutFromForm(
  values: WorkoutFormValues,
  position: number,
): WorkoutValue {
  return {
    ...values,
    id: uuidv4(),
    position,
  };
}
