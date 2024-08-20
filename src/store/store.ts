import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from '@/features/exercises/exercises-slice';
import workoutsReducer from '@/features/workouts/workouts-slice';
import {
  INIT_ACTION_TYPE,
  listenerMiddleware,
} from '@/store/middlewareListener';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
    workouts: workoutsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

store.dispatch({ type: INIT_ACTION_TYPE });
