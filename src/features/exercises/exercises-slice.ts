import { db } from '@/db';
import {
  ExerciseValue,
  NewExerciseFormValues,
} from '@/features/exercises/exercises-schema';
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
    setExercises(state, action: PayloadAction<ExerciseValue[]>) {
      state.values = action.payload;
    },
    addExercise(state, action: PayloadAction<NewExerciseFormValues>) {
      const value = { ...action.payload, id: crypto.randomUUID() };
      state.values.push(value);
      db.exercises.add(value);
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

export const { addExercise, setExercises, deleteExercise, updateExercise } =
  exercisesSlice.actions;
export default exercisesSlice.reducer;
