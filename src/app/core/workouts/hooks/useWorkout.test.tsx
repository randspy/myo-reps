import { useWorkout } from '@/app/core/workouts/hooks/useWorkout';
import {
  generateExercise,
  generateWorkout,
  renderHookWithProviders,
} from '@/lib/test-utils';
import { act } from '@testing-library/react';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { EnhancedStore } from '@reduxjs/toolkit';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

describe('useWorkout hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('dispatchAdd', () => {
    test('add a workout with two exercises', () => {
      const { result, store } = renderHookWithProviders(() => useWorkout(), {
        preloadedState: {
          exercises: {
            values: [
              generateExercise({
                id: 'exercise-1',
              }),
              generateExercise({
                id: 'exercise-2',
              }),
            ],
          },
          workouts: {
            values: [],
          },
        },
      });

      const workoutFormValues = {
        id: 'workout-1',
        name: 'Morning workout',
        exercises: [
          {
            id: '1',
            sets: 3,
            exerciseId: 'exercise-1',
          },
          {
            id: '2',
            sets: 3,
            exerciseId: 'exercise-2',
          },
        ],
      };

      act(() => {
        result.current.dispatchAdd(workoutFormValues);
      });

      expect(workout(store, 'workout-1')).toEqual({
        ...workoutFormValues,
        position: 0,
      });

      expect(exerciseUsage(store, 'exercise-1')).toEqual([{ id: 'workout-1' }]);
      expect(exerciseUsage(store, 'exercise-2')).toEqual([{ id: 'workout-1' }]);
    });

    test('add a workout with the same exercise twice', () => {
      const { result, store } = renderHookWithProviders(() => useWorkout(), {
        preloadedState: {
          exercises: {
            values: [
              generateExercise({
                id: 'exercise-1',
              }),
            ],
          },
          workouts: {
            values: [],
          },
        },
      });

      const workoutFormValues = {
        id: 'workout-1',
        name: 'Morning workout',
        exercises: [
          {
            id: '1',
            sets: 3,
            exerciseId: 'exercise-1',
          },
          {
            id: '1',
            sets: 1,
            exerciseId: 'exercise-1',
          },
        ],
      };

      act(() => {
        result.current.dispatchAdd(workoutFormValues);
      });

      expect(workout(store, 'workout-1')).toEqual({
        ...workoutFormValues,
        position: 0,
      });

      expect(exerciseUsage(store, 'exercise-1')).toEqual([{ id: 'workout-1' }]);
    });
  });

  test('dispatchUpdate', () => {
    const { result, store } = renderHookWithProviders(() => useWorkout(), {
      preloadedState: {
        exercises: {
          values: [
            generateExercise({
              id: 'exercise-1',
              usage: [{ id: 'workout-1' }],
            }),
            generateExercise({
              id: 'exercise-2',
              usage: [{ id: 'workout-1' }],
            }),
            generateExercise({
              id: 'exercise-3',
            }),
            generateExercise({
              id: 'exercise-4',
              usage: [{ id: 'workout-1' }],
            }),
          ],
        },
        workouts: {
          values: [
            generateWorkout({
              id: 'workout-1',
              exercises: [
                {
                  id: '1',
                  sets: 3,
                  exerciseId: 'exercise-1',
                },
                { id: '2', sets: 3, exerciseId: 'exercise-2' },
                { id: '4', sets: 3, exerciseId: 'exercise-4' },
                { id: '5', sets: 3, exerciseId: 'exercise-4' },
              ],
            }),
          ],
        },
      },
    });

    const updatedWorkout = generateWorkout({
      id: 'workout-1',
      name: 'Morning workout',
      exercises: [
        {
          id: '2',
          sets: 3,
          exerciseId: 'exercise-2',
        },
        { id: '3', sets: 3, exerciseId: 'exercise-3' },
        { id: '4', sets: 3, exerciseId: 'exercise-4' },
      ],
    });

    act(() => {
      result.current.dispatchUpdate(updatedWorkout);
    });

    expect(workout(store, 'workout-1')).toEqual(updatedWorkout);
    expect(exerciseUsage(store, 'exercise-1')).toEqual([]);
    expect(exerciseUsage(store, 'exercise-2')).toEqual([{ id: 'workout-1' }]);
    expect(exerciseUsage(store, 'exercise-3')).toEqual([{ id: 'workout-1' }]);
    expect(exerciseUsage(store, 'exercise-4')).toEqual([{ id: 'workout-1' }]);
  });

  test('dispatchDelete', () => {
    const { result, store } = renderHookWithProviders(() => useWorkout(), {
      preloadedState: {
        exercises: {
          values: [
            generateExercise({
              id: 'exercise-1',
              usage: [{ id: 'workout-1' }],
            }),
            generateExercise({
              id: 'exercise-2',
              usage: [{ id: 'workout-1' }],
            }),
          ],
        },
        workouts: {
          values: [
            generateWorkout({
              id: 'workout-1',
              exercises: [
                {
                  id: '1',
                  sets: 3,
                  exerciseId: 'exercise-1',
                },
                {
                  id: '1',
                  sets: 3,
                  exerciseId: 'exercise-2',
                },
              ],
            }),
          ],
        },
      },
    });

    const workoutId = 'workout-1';

    act(() => {
      result.current.dispatchDelete(workoutId);
    });

    expect(store.getState().workouts.values).toHaveLength(0);
    expect(exerciseUsage(store, 'exercise-1')).toEqual([]);
    expect(exerciseUsage(store, 'exercise-2')).toEqual([]);
  });
});

function exerciseUsage(store: EnhancedStore, id: string) {
  return store
    .getState()
    .exercises.values.find((exercise: ExerciseValue) => exercise.id === id)
    .usage;
}

function workout(store: EnhancedStore, id: string) {
  return store
    .getState()
    .workouts.values.find((workout: WorkoutValue) => workout.id === id);
}
