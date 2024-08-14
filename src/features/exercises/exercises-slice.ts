import {
  ExerciseFormValues,
  NewExerciseFormValues,
} from '@/features/exercises/exercises-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExercisesState {
  values: ExerciseFormValues[];
}

const initialState: ExercisesState = {
  values: [],
};

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    addExercise(state, action: PayloadAction<NewExerciseFormValues>) {
      state.values.push({ ...action.payload, id: crypto.randomUUID() });
    },
  },
});

export const { addExercise } = exercisesSlice.actions;
export default exercisesSlice.reducer;
