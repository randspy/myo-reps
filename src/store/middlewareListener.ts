import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';
import { restoreFromDB } from '@/db';

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

export { listenerMiddleware, INIT_ACTION_TYPE };
