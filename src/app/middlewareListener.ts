import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';
import { setExercises } from '@/features/exercises/exercises-slice';
import { db } from '@/db';
const INIT_ACTION_TYPE = 'store/init';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: createAction(INIT_ACTION_TYPE),
  effect: async (_, listenerApi) => {
    listenerApi.cancelActiveListeners();

    const values = await db.exercises.toArray();
    listenerApi.dispatch(setExercises(values));
  },
});

export { listenerMiddleware, INIT_ACTION_TYPE };
