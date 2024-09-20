import { act, renderHook } from '@testing-library/react';
import { useWorkoutsStore } from './workouts-store';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { generateWorkout } from '@/lib/test-utils';

describe('useWorkoutsStore', () => {
  beforeEach(() => {
    act(() => {
      useWorkoutsStore.setState({ workouts: [] });
    });
  });

  test('should initialize with an empty workouts array', () => {
    const { result } = renderHook(() => useWorkoutsStore());
    expect(result.current.workouts).toEqual([]);
  });

  test('should restore workouts and sort them', () => {
    const { result } = renderHook(() => useWorkoutsStore());
    const workouts: WorkoutValue[] = [
      generateWorkout({ id: '1', name: 'Workout 1', position: 2 }),
      generateWorkout({ id: '2', name: 'Workout 2', position: 0 }),
      generateWorkout({ id: '3', name: 'Workout 3', position: 1 }),
    ];

    act(() => {
      result.current.restoreWorkouts(workouts);
    });

    expect(result.current.workouts).toEqual([
      workouts[1],
      workouts[2],
      workouts[0],
    ]);
  });

  test('should set workouts without sorting', () => {
    const { result } = renderHook(() => useWorkoutsStore());
    const workouts: WorkoutValue[] = [
      generateWorkout({ id: '1', name: 'Workout 1', position: 2 }),
      generateWorkout({ id: '2', name: 'Workout 2', position: 0 }),
      generateWorkout({ id: '3', name: 'Workout 3', position: 1 }),
    ];

    act(() => {
      result.current.setWorkouts(workouts);
    });

    expect(result.current.workouts).toEqual(workouts);
  });

  test('should add a workout', () => {
    const { result } = renderHook(() => useWorkoutsStore());
    const workout = generateWorkout({ id: '1', name: 'New Workout' });

    act(() => {
      result.current.addWorkout(workout);
    });

    expect(result.current.workouts).toEqual([workout]);
  });

  test('should delete a workout', () => {
    const { result } = renderHook(() => useWorkoutsStore());
    const workouts: WorkoutValue[] = [
      generateWorkout({ id: '1', name: 'Workout 1' }),
      generateWorkout({ id: '2', name: 'Workout 2' }),
    ];

    act(() => {
      result.current.setWorkouts(workouts);
    });

    act(() => {
      result.current.deleteWorkout('1');
    });

    expect(result.current.workouts).toEqual([workouts[1]]);
  });

  test('should update a workout', () => {
    const { result } = renderHook(() => useWorkoutsStore());
    const workouts: WorkoutValue[] = [
      generateWorkout({ id: '1', name: 'Workout 1' }),
      generateWorkout({ id: '2', name: 'Workout 2' }),
    ];

    act(() => {
      result.current.setWorkouts(workouts);
    });

    const updatedWorkout = generateWorkout({
      ...workouts[0],
      name: 'Updated Workout',
    });

    act(() => {
      result.current.updateWorkout(updatedWorkout);
    });

    expect(result.current.workouts).toEqual([updatedWorkout, workouts[1]]);
  });
});
