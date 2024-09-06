import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';
import { restoreFromDB } from '@/db';
import { exerciseListeners } from '@/app/core/exercises/store/exercises-slice';
import { workoutListeners } from '@/app/core/workouts/store/workouts-slice';

const INIT_ACTION_TYPE = 'store/init';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: createAction(INIT_ACTION_TYPE),
  effect: async (_, listenerApi) => {
    listenerApi.cancelActiveListeners();

    const stores = await restoreFromDB();
    for (const store of stores) {
      listenerApi.dispatch(store);
    }
  },
});

for (const listener of [...exerciseListeners, ...workoutListeners]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenerMiddleware.startListening(listener as any);
}

export { listenerMiddleware, INIT_ACTION_TYPE };
