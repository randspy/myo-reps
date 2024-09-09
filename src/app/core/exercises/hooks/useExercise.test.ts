import { useExercise } from './useExercise';
import { v4 } from 'uuid';
import {
  ExerciseFormValues,
  ExerciseValue,
} from '@/app/core/exercises/exercises-schema';
import { renderHookWithProviders } from '@/lib/test-utils';
import { generateExercise } from '@/lib/test-utils';
import { act } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

describe('useExercise', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return exercises and activeExercises', () => {
    const initialState = [
      generateExercise({
        id: 'exercise-1',
        name: 'Push-up',
      }),
      generateExercise({
        id: 'exercise-2',
        name: 'Pull-up',
        usage: [
          {
            id: '1',
          },
        ],
        hidden: true,
      }),
    ];

    const { result } = renderHookWithProviders(() => useExercise(), {
      preloadedState: {
        exercises: {
          values: initialState,
        },
      },
    });

    expect(result.current.exercises).toEqual(initialState);
    expect(result.current.activeExercises).toEqual([initialState[0]]);
  });

  test('should add exercise', () => {
    const id = 'exercise-1';
    vi.mocked(v4).mockImplementation(() => id);

    const { result, store } = renderHookWithProviders(() => useExercise());
    const newExercise: ExerciseFormValues = { name: 'added exercise' };

    act(() => {
      result.current.dispatchAdd(newExercise);
    });

    expect(store.getState().exercises.values[0]).toEqual({
      ...newExercise,
      id,
      hidden: false,
      usage: [],
      position: 0,
    });
  });

  test('should dispatch updateExercise action', () => {
    const { result, store } = renderHookWithProviders(() => useExercise(), {
      preloadedState: {
        exercises: {
          values: [generateExercise({ id: 'exercise-1' })],
        },
      },
    });

    const updatedExercise: ExerciseValue = generateExercise({
      id: 'exercise-1',
      name: 'Updated Exercise',
    });

    act(() => {
      result.current.dispatchUpdate(updatedExercise);
    });

    expect(exercise(store, 'exercise-1')).toEqual(updatedExercise);
  });

  test('should set exercise', () => {
    const { result, store } = renderHookWithProviders(() => useExercise());

    const exercises = [
      generateExercise({ id: 'exercise-1', position: 1 }),
      generateExercise({ id: 'exercise-2', position: 0 }),
    ];

    act(() => {
      result.current.dispatchSet(exercises);
    });

    expect(store.getState().exercises.values).toEqual(
      exercises.map((exercise, idx) => ({ ...exercise, position: idx })),
    );
  });

  describe('delete exercise', () => {
    test('should hide if exercise is in use', () => {
      const { result, store } = renderHookWithProviders(() => useExercise(), {
        preloadedState: {
          exercises: {
            values: [
              generateExercise({
                id: 'exercise-1',
                usage: [{ id: 'workout-1' }],
              }),
            ],
          },
        },
      });

      act(() => {
        result.current.dispatchDelete('exercise-1');
      });

      expect(exercise(store, 'exercise-1')).toEqual(
        generateExercise({
          id: 'exercise-1',
          usage: [{ id: 'workout-1' }],
          hidden: true,
        }),
      );
    });

    test('should delete action if exercise is not in use', () => {
      const { result, store } = renderHookWithProviders(() => useExercise(), {
        preloadedState: {
          exercises: {
            values: [
              generateExercise({
                id: 'exercise-1',
                usage: [],
              }),
            ],
          },
        },
      });

      act(() => {
        result.current.dispatchDelete('exercise-1');
      });

      expect(store.getState().exercises.values.length).toEqual(0);
    });
  });

  test('should add usage', () => {
    const { result, store } = renderHookWithProviders(() => useExercise(), {
      preloadedState: {
        exercises: {
          values: [generateExercise({ id: 'exercise-1' })],
        },
      },
    });

    act(() => {
      result.current.dispatchAddUsage({
        exerciseId: 'exercise-1',
        userId: '1',
      });
    });

    expect(exercise(store, 'exercise-1')).toEqual(
      generateExercise({
        id: 'exercise-1',
        usage: [{ id: '1' }],
      }),
    );
  });

  describe('remove usage', () => {
    test('should remove usage', () => {
      const { result, store } = renderHookWithProviders(() => useExercise(), {
        preloadedState: {
          exercises: {
            values: [
              generateExercise({
                id: 'exercise-1',
                usage: [{ id: '1' }],
              }),
            ],
          },
        },
      });

      act(() => {
        result.current.dispatchRemoveUsage({
          exerciseId: 'exercise-1',
          userId: '1',
        });
      });

      expect(exercise(store, 'exercise-1')).toEqual(
        generateExercise({
          id: 'exercise-1',
          usage: [],
        }),
      );
    });

    test('should delete exercise if exercise is hidden and has no usage outside provided user id', () => {
      const { result, store } = renderHookWithProviders(() => useExercise(), {
        preloadedState: {
          exercises: {
            values: [
              generateExercise({
                id: 'exercise-1',
                usage: [{ id: '1' }],
                hidden: true,
              }),
            ],
          },
        },
      });

      act(() => {
        result.current.dispatchRemoveUsage({
          exerciseId: 'exercise-1',
          userId: '1',
        });
      });

      expect(store.getState().exercises.values.length).toEqual(0);
    });
  });
});

function exercise(store: EnhancedStore, id: string) {
  return store
    .getState()
    .exercises.values.find((exercise: ExerciseValue) => exercise.id === id);
}
