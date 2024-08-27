import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';
import { restoreExercises } from '@/app/core/exercises/exercises-slice';
import { restoreWorkouts } from '@/app/core/workouts/workouts-slice';
import { db } from '@/db';

const INIT_ACTION_TYPE = 'store/init';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: createAction(INIT_ACTION_TYPE),
  effect: async (_, listenerApi) => {
    listenerApi.cancelActiveListeners();

    const exercises = await db.exercises.toArray();
    listenerApi.dispatch(restoreExercises(exercises));

    const workouts = await db.workouts.toArray();
    listenerApi.dispatch(restoreWorkouts(workouts));
  },
});

export { listenerMiddleware, INIT_ACTION_TYPE };
