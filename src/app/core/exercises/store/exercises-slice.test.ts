import reducer, {
  addExercise,
  deleteExercise,
  restoreExercises,
  setExercises,
  updateExercise,
} from '@/app/core/exercises/store/exercises-slice';
import { db } from '@/db';

import { generateExercise } from '@/lib/test-utils';
import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from '@/store/middlewareListener';
import { waitFor } from '@testing-library/react';

export const setupStore = (
  preloadedState: unknown = { exercises: { values: [] } },
) => {
  return configureStore({
    reducer: {
      exercises: reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    preloadedState,
  });
};

describe('exercises slice', () => {
  describe('add exercise', () => {
    test('should add a new exercise to the state', async () => {
      const store = setupStore({ exercises: { values: [] } });

      const newExercise = generateExercise({
        id: '1',
        name: 'Squats',
        description: 'Squats description',
      });

      store.dispatch(addExercise(newExercise));

      await waitFor(() => {
        expect(store.getState().exercises.values).toEqual([newExercise]);
        expect(db.exercises.add).toHaveBeenCalledWith(
          generateExercise(newExercise),
        );
      });
    });
  });

  describe('delete exercise', () => {
    test('should delete an exercise from the state', async () => {
      const store = setupStore({
        exercises: {
          values: [
            generateExercise({
              id: '1',
              name: 'Squats',
            }),
          ],
        },
      });

      store.dispatch(deleteExercise('1'));

      await waitFor(() => {
        expect(store.getState().exercises.values).toHaveLength(0);
        expect(db.exercises.delete).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('update exercise', () => {
    test('should update an exercise in the state', async () => {
      const store = setupStore({
        exercises: {
          values: [
            generateExercise({
              id: '1',
              name: 'Squats',
            }),
          ],
        },
      });

      const updatedExercise = generateExercise({
        id: '1',
        name: 'Push ups',
      });

      store.dispatch(updateExercise(updatedExercise));

      await waitFor(() => {
        expect(store.getState().exercises.values).toEqual([updatedExercise]);
        expect(db.exercises.update).toHaveBeenCalledWith('1', updatedExercise);
      });
    });
  });

  describe('set exercises', () => {
    test('should set the exercises in the state', async () => {
      const store = setupStore();

      const exercises = [
        generateExercise({
          id: '1',
          position: 0,
          name: 'Squats',
        }),
        generateExercise({
          id: '2',
          position: 1,
          name: 'Push ups',
        }),
      ];

      store.dispatch(setExercises(exercises));

      await waitFor(() => {
        expect(store.getState().exercises.values).toEqual(exercises);
        expect(db.exercises.bulkPut).toHaveBeenCalledWith(exercises);
      });
    });
  });

  describe('restore exercises', () => {
    test('should restore the exercises in the state', () => {
      const initialState = {
        values: [],
      };

      const exercises = [
        generateExercise({
          id: '1',
          position: 1,
          name: 'Squats',
        }),
        generateExercise({
          id: '2',
          position: 0,
          name: 'Push ups',
        }),
      ];

      const action = restoreExercises(exercises);

      const nextState = reducer(initialState, action);

      expect(nextState.values).toEqual([exercises[1], exercises[0]]);
    });
  });
});
