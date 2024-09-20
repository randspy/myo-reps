import { act, renderHook } from '@testing-library/react';
import { useExerciseActions } from './useExerciseActions';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { ExerciseDbService } from '@/app/core/exercises/services/exercise-db-service';
import { generateExercise } from '@/lib/test-utils';
import { vi, describe, beforeEach, test, expect } from 'vitest';

vi.mock('@/app/core/exercises/services/exercise-db-service', () => ({
  ExerciseDbService: {
    bulkPut: vi.fn(),
    add: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

describe('useExerciseActions', () => {
  beforeEach(() => {
    useExercisesStore.getState().setExercises([]);
    vi.clearAllMocks();
  });

  test('setExercises should update store and call bulkPut', async () => {
    const { result } = renderHook(() => useExerciseActions());
    const exercises = [generateExercise(), generateExercise()];

    await act(async () => {
      await result.current.setExercises(exercises);
    });

    expect(useExercisesStore.getState().exercises).toEqual(exercises);
    expect(ExerciseDbService.bulkPut).toHaveBeenCalledWith(exercises);
  });

  test('addExercise should update store and call add', async () => {
    const { result } = renderHook(() => useExerciseActions());
    const exercise = generateExercise();

    await act(async () => {
      await result.current.addExercise(exercise);
    });

    expect(useExercisesStore.getState().exercises).toContain(exercise);
    expect(ExerciseDbService.add).toHaveBeenCalledWith(exercise);
  });

  test('deleteExercise should update store and call delete', async () => {
    const exercise = generateExercise();
    useExercisesStore.setState({ exercises: [exercise] });

    const { result } = renderHook(() => useExerciseActions());

    await act(async () => {
      await result.current.deleteExercise(exercise.id);
    });

    expect(useExercisesStore.getState().exercises).not.toContain(exercise);
    expect(ExerciseDbService.delete).toHaveBeenCalledWith(exercise.id);
  });

  test('updateExercise should update store and call update', async () => {
    const exercise = generateExercise();
    useExercisesStore.setState({ exercises: [exercise] });
    const { result } = renderHook(() => useExerciseActions());

    const updatedExercise = { ...exercise, name: 'Updated Exercise' };

    await act(async () => {
      await result.current.updateExercise(updatedExercise);
    });

    expect(useExercisesStore.getState().exercises[0]).toEqual(updatedExercise);
    expect(ExerciseDbService.update).toHaveBeenCalledWith(updatedExercise);
  });
});
