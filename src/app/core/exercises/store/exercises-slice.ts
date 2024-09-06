import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { listenerMiddleware } from '@/store/middlewareListener';
import { db } from '@/db';

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
      state.values = action.payload;
    },
    addExercise(state, action: PayloadAction<ExerciseValue>) {
      state.values.push(action.payload);
    },
    deleteExercise(state, action: PayloadAction<string>) {
      state.values = state.values.filter(
        (exercise) => exercise.id !== action.payload,
      );
    },
    updateExercise(state, action: PayloadAction<ExerciseValue>) {
      const index = state.values.findIndex(
        (exercise) => exercise.id === action.payload.id,
      );
      state.values[index] = action.payload;
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

listenerMiddleware.startListening({
  actionCreator: setExercises,
  effect: (action: PayloadAction<ExerciseValue[]>) => {
    db.exercises.bulkPut(action.payload);
  },
});

listenerMiddleware.startListening({
  actionCreator: addExercise,
  effect: (action: PayloadAction<ExerciseValue>) => {
    db.exercises.add(action.payload);
  },
});

listenerMiddleware.startListening({
  actionCreator: deleteExercise,
  effect: (action: PayloadAction<string>) => {
    db.exercises.delete(action.payload);
  },
});

listenerMiddleware.startListening({
  actionCreator: updateExercise,
  effect: (action: PayloadAction<ExerciseValue>) => {
    db.exercises.update(action.payload.id, action.payload);
  },
});
