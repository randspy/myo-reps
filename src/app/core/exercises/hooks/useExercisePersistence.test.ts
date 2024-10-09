import { act, renderHook } from '@testing-library/react';
import { useExercisePersistence } from './useExercisePersistence';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { generateExercise } from '@/lib/test-utils';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import { db } from '@/db';

describe('useExercisePersistence', () => {
  beforeEach(() => {
    useExercisesStore.getState().setExercises([]);
    vi.clearAllMocks();
  });

  test('setExercises should update store and call bulkPut', async () => {
    const { result } = renderHook(() => useExercisePersistence());
    const exercises = [generateExercise(), generateExercise()];

    await act(async () => {
      await result.current.setExercises(exercises);
    });

    expect(useExercisesStore.getState().exercises).toEqual(exercises);
    expect(db.exercises.bulkPut).toHaveBeenCalledWith(exercises);
  });

  test('addExercise should update store and call add', async () => {
    const { result } = renderHook(() => useExercisePersistence());
    const exercise = generateExercise();

    await act(async () => {
      await result.current.addExercise(exercise);
    });

    expect(useExercisesStore.getState().exercises).toContain(exercise);
    expect(db.exercises.add).toHaveBeenCalledWith(exercise);
  });

  test('deleteExercise should update store and call delete', async () => {
    const exercise = generateExercise();
    useExercisesStore.setState({ exercises: [exercise] });

    const { result } = renderHook(() => useExercisePersistence());

    await act(async () => {
      await result.current.deleteExercise(exercise.id);
    });

    expect(useExercisesStore.getState().exercises).not.toContain(exercise);
    expect(db.exercises.delete).toHaveBeenCalledWith(exercise.id);
  });

  test('updateExercise should update store and call update', async () => {
    const exercise = generateExercise();
    useExercisesStore.setState({ exercises: [exercise] });
    const { result } = renderHook(() => useExercisePersistence());

    const updatedExercise = { ...exercise, name: 'Updated Exercise' };

    await act(async () => {
      await result.current.updateExercise(updatedExercise);
    });

    expect(useExercisesStore.getState().exercises[0]).toEqual(updatedExercise);
    expect(db.exercises.update).toHaveBeenCalledWith(
      updatedExercise.id,
      updatedExercise,
    );
  });
});
