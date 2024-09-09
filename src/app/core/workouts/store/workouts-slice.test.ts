import reducer, {
  addWorkout,
  deleteWorkout,
  restoreWorkouts,
  setWorkouts,
  updateWorkout,
} from '@/app/core/workouts/store/workouts-slice';
import { db } from '@/db';
import { generateWorkout } from '@/lib/test-utils';
import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from '@/store/middlewareListener';
import { waitFor } from '@testing-library/react';

export const setupStore = (
  preloadedState: unknown = { workouts: { values: [] } },
) => {
  return configureStore({
    reducer: {
      workouts: reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    preloadedState,
  });
};

describe('workout slice', () => {
  describe('add workout', () => {
    test('should add a new workout to the state', async () => {
      const store = setupStore();

      const newWorkout = generateWorkout({
        name: 'Squats',
        id: '1',
      });

      store.dispatch(addWorkout(newWorkout));

      await waitFor(() => {
        expect(store.getState().workouts.values).toEqual([newWorkout]);
        expect(db.workouts.add).toHaveBeenCalledWith(newWorkout);
      });
    });
  });

  describe('delete workout', () => {
    test('should delete an workout from the state', async () => {
      const store = setupStore({
        workouts: {
          values: [
            generateWorkout({
              id: '1',
              name: 'Squats',
            }),
          ],
        },
      });

      store.dispatch(deleteWorkout('1'));

      await waitFor(() => {
        expect(store.getState().workouts.values).toHaveLength(0);
        expect(db.workouts.delete).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('update workout', () => {
    test('should update an workout in the state', async () => {
      const store = setupStore({
        workouts: {
          values: [
            generateWorkout({
              id: '1',
              name: 'Squats',
            }),
          ],
        },
      });

      const updatedWorkout = generateWorkout({
        id: '1',
        name: 'Push ups',
      });

      store.dispatch(updateWorkout(updatedWorkout));

      await waitFor(() => {
        expect(store.getState().workouts.values).toEqual([updatedWorkout]);
        expect(db.workouts.update).toHaveBeenCalledWith('1', updatedWorkout);
      });
    });
  });

  describe('set workouts', () => {
    test('should set the workouts in the state', async () => {
      const store = setupStore();

      const workouts = [
        generateWorkout({
          id: '1',
          name: 'Squats',
          position: 0,
        }),
        generateWorkout({
          id: '2',
          name: 'Push ups',
          position: 1,
        }),
      ];

      store.dispatch(setWorkouts(workouts));

      await waitFor(() => {
        expect(store.getState().workouts.values).toEqual(workouts);
        expect(db.workouts.bulkPut).toHaveBeenCalledWith(workouts);
      });
    });
  });

  describe('restore workouts', () => {
    test('should set the restore in the state', () => {
      const initialState = {
        values: [],
      };

      const workouts = [
        generateWorkout({
          id: '1',
          position: 1,
          name: 'Squats',
        }),
        generateWorkout({
          id: '2',
          position: 0,
          name: 'Push ups',
        }),
      ];

      const action = restoreWorkouts(workouts);

      const nextState = reducer(initialState, action);

      expect(nextState.values).toEqual([workouts[1], workouts[0]]);
    });
  });
});
