import { db } from '@/db';
import {
  ExerciseValue,
  ExerciseFormValues,
} from '@/features/exercises/exercises-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

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
    addExercise(state, action: PayloadAction<ExerciseFormValues>) {
      const value = createExerciseFromForm(action.payload, state.values.length);
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
    addUsage(
      state,
      action: PayloadAction<{ exerciseId: string; userId: string }>,
    ) {
      const index = state.values.findIndex(
        (exercise) => exercise.id === action.payload.exerciseId,
      );

      if (index !== -1) {
        state.values[index].usage.push({
          id: action.payload.userId,
        });

        db.exercises.update(action.payload.exerciseId, {
          ...state.values[index],
          usage: state.values[index].usage.map((item) => ({ ...item })),
        });
      }
    },
    removeUsage(
      state,
      action: PayloadAction<{ exerciseId: string; userId: string }>,
    ) {
      const index = state.values.findIndex(
        (exercise) => exercise.id === action.payload.exerciseId,
      );

      if (index !== -1) {
        state.values[index].usage = state.values[index].usage.filter(
          (item) => item.id !== action.payload.userId,
        );

        db.exercises.update(action.payload.exerciseId, {
          ...state.values[index],
          usage: state.values[index].usage.map((item) => ({ ...item })),
        });
      }
    },
  },
});

export const {
  addExercise,
  setExercises,
  deleteExercise,
  updateExercise,
  restoreExercises,
  addUsage,
  removeUsage,
} = exercisesSlice.actions;
export default exercisesSlice.reducer;

function updateExercisePositions(exercises: ExerciseValue[]) {
  return exercises.map((exercise, idx) => ({
    ...exercise,
    position: idx,
  }));
}

function createExerciseFromForm(
  values: ExerciseFormValues,
  position: number,
): ExerciseValue {
  return {
    ...values,
    id: uuidv4(),
    position,
    usage: [],
  };
}
