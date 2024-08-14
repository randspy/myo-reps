import {
  ExerciseValue,
  NewExerciseFormValues,
} from '@/features/exercises/exercises-schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExercisesState {
  values: ExerciseValue[];
}

const initialState: ExercisesState = {
  values: [
    // {
    //   id: '1',
    //   name: 'Push up',
    //   description: 'Push up description',
    // },
    // {
    //   id: '2',
    //   name: 'Pull up',
    // },
    // {
    //   id: '3',
    //   name: 'Squat',
    //   description: `Squat description \n
    //   iirwerwrwewe`,
    // },
    // {
    //   id: '4',
    //   name: 'Bench press',
    //   description: 'Bench press description',
    // },
    // {
    //   id: '5',
    //   name: 'Deadlift',
    //   description: 'Deadlift description',
    // },
    // {
    //   id: '6',
    //   name: 'Overhead press',
    //   description: 'Overhead press description',
    // },
    // {
    //   id: '7',
    //   name: 'Barbell row',
    //   description: 'Barbell row description',
    // },
    // {
    //   id: '8',
    //   name: 'Lunges',
    //   description: 'Lunges description',
    // },
  ],
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
