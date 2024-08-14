import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from '@/features/exercises/exercises-slice';

export const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
