import { act, renderHook } from '@testing-library/react';
import { useExercisesStore } from './exercises-store';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { generateExercise } from '@/lib/test-utils';

describe('useExercisesStore', () => {
  beforeEach(() => {
    act(() => {
      useExercisesStore.setState({ exercises: [] });
    });
  });

  test('should initialize with an empty exercises array', () => {
    const { result } = renderHook(() => useExercisesStore());
    expect(result.current.exercises).toEqual([]);
  });

  test('should restore exercises and sort them', () => {
    const { result } = renderHook(() => useExercisesStore());
    const exercises: ExerciseValue[] = [
      generateExercise({ id: '1', name: 'Exercise 1', position: 2 }),
      generateExercise({ id: '2', name: 'Exercise 2', position: 0 }),
      generateExercise({ id: '3', name: 'Exercise 3', position: 1 }),
    ];

    act(() => {
      result.current.restoreExercises(exercises);
    });

    expect(result.current.exercises).toEqual([
      exercises[1],
      exercises[2],
      exercises[0],
    ]);
  });

  test('should set exercises without sorting', () => {
    const { result } = renderHook(() => useExercisesStore());
    const exercises: ExerciseValue[] = [
      generateExercise({ id: '1', name: 'Exercise 1', position: 2 }),
      generateExercise({ id: '2', name: 'Exercise 2', position: 0 }),
      generateExercise({ id: '3', name: 'Exercise 3', position: 1 }),
    ];

    act(() => {
      result.current.setExercises(exercises);
    });

    expect(result.current.exercises).toEqual(exercises);
  });

  test('should add an exercise', () => {
    const { result } = renderHook(() => useExercisesStore());
    const exercise = generateExercise({ id: '1', name: 'New Exercise' });

    act(() => {
      result.current.addExercise(exercise);
    });

    expect(result.current.exercises).toEqual([exercise]);
  });

  test('should delete an exercise', () => {
    const { result } = renderHook(() => useExercisesStore());
    const exercises: ExerciseValue[] = [
      generateExercise({ id: '1', name: 'Exercise 1' }),
      generateExercise({ id: '2', name: 'Exercise 2' }),
    ];

    act(() => {
      result.current.setExercises(exercises);
    });

    act(() => {
      result.current.deleteExercise('1');
    });

    expect(result.current.exercises).toEqual([exercises[1]]);
  });

  test('should update an exercise', () => {
    const { result } = renderHook(() => useExercisesStore());
    const exercises: ExerciseValue[] = [
      generateExercise({ id: '1', name: 'Exercise 1' }),
      generateExercise({ id: '2', name: 'Exercise 2' }),
    ];

    act(() => {
      result.current.setExercises(exercises);
    });

    const updatedExercise = generateExercise({
      ...exercises[0],
      name: 'Updated Exercise',
    });

    act(() => {
      result.current.updateExercise(updatedExercise);
    });

    expect(result.current.exercises).toEqual([updatedExercise, exercises[1]]);
  });
});
