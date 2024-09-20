import { act, renderHook } from '@testing-library/react';
import { useWorkoutActions } from './useWorkoutActions';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { WorkoutDbService } from '@/app/core/workouts/services/workout-db-service';
import { generateWorkout } from '@/lib/test-utils';
import { vi, describe, beforeEach, test, expect } from 'vitest';

vi.mock('@/app/core/workouts/services/workout-db-service', () => ({
  WorkoutDbService: {
    bulkPut: vi.fn(),
    add: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

describe('useWorkoutActions', () => {
  beforeEach(() => {
    useWorkoutsStore.getState().setWorkouts([]);
    vi.clearAllMocks();
  });

  test('setWorkouts should update store and call bulkPut', async () => {
    const { result } = renderHook(() => useWorkoutActions());
    const workouts = [generateWorkout(), generateWorkout()];

    await act(async () => {
      await result.current.setWorkouts(workouts);
    });

    expect(useWorkoutsStore.getState().workouts).toEqual(workouts);
    expect(WorkoutDbService.bulkPut).toHaveBeenCalledWith(workouts);
  });

  test('addWorkout should update store and call add', async () => {
    const { result } = renderHook(() => useWorkoutActions());
    const workout = generateWorkout();

    await act(async () => {
      await result.current.addWorkout(workout);
    });

    expect(useWorkoutsStore.getState().workouts).toContain(workout);
    expect(WorkoutDbService.add).toHaveBeenCalledWith(workout);
  });

  test('deleteWorkout should update store and call delete', async () => {
    const workout = generateWorkout();
    useWorkoutsStore.setState({ workouts: [workout] });

    const { result } = renderHook(() => useWorkoutActions());

    await act(async () => {
      await result.current.deleteWorkout(workout.id);
    });

    expect(useWorkoutsStore.getState().workouts).not.toContain(workout);
    expect(WorkoutDbService.delete).toHaveBeenCalledWith(workout.id);
  });

  test('updateWorkout should update store and call update', async () => {
    const workout = generateWorkout();
    useWorkoutsStore.setState({ workouts: [workout] });
    const { result } = renderHook(() => useWorkoutActions());

    const updatedWorkout = { ...workout, name: 'Updated Workout' };

    await act(async () => {
      await result.current.updateWorkout(updatedWorkout);
    });

    expect(useWorkoutsStore.getState().workouts[0]).toEqual(updatedWorkout);
    expect(WorkoutDbService.update).toHaveBeenCalledWith(updatedWorkout);
  });
});
