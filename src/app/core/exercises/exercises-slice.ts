import { db } from '@/db';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExercisesState {
  values: ExerciseValue[];
}

const initialState: ExercisesState = {
  values: [],
};

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    restoreExercises(state, action: PayloadAction<ExerciseValue[]>) {
      state.values = action.payload.toSorted((a, b) => a.position - b.position);
    },
    setExercises(state, action: PayloadAction<ExerciseValue[]>) {
      const values = updateExercisePositions(action.payload);
      state.values = values;
      db.exercises.bulkPut(values);
    },
    addExercise(state, action: PayloadAction<ExerciseValue>) {
      state.values.push(action.payload);
      db.exercises.add(action.payload);
    },
    deleteExercise(state, action: PayloadAction<string>) {
      state.values = state.values.filter(
        (exercise) => exercise.id !== action.payload,
      );
      db.exercises.delete(action.payload);
    },
    updateExercise(state, action: PayloadAction<ExerciseValue>) {
      const index = state.values.findIndex(
        (exercise) => exercise.id === action.payload.id,
      );
      state.values[index] = action.payload;
      db.exercises.update(action.payload.id, action.payload);
    },
  },
});

export const {
  addExercise,
  setExercises,
  deleteExercise,
  updateExercise,
  restoreExercises,
} = exercisesSlice.actions;
export default exercisesSlice.reducer;

function updateExercisePositions(exercises: ExerciseValue[]) {
  return exercises.map((exercise, idx) => ({
    ...exercise,
    position: idx,
  }));
}
