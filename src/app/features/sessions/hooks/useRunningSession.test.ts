import { useRunningSession } from './useRunningSession';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { act, renderHook } from '@testing-library/react';
import { generateExercise, generateWorkout } from '@/lib/test-utils';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { WorkoutValue } from '@/app/core/workouts/workouts-types';
import { TimeBetweenExercisesInSeconds } from '@/app/core/exercises/domain/exercises-config';

describe('useRunningSession', () => {
  let exercises: ExerciseValue[];
  let workouts: WorkoutValue[];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    exercises = [
      generateExercise({ id: '1', name: 'Exercise 1' }),
      generateExercise({ id: '2', name: 'Exercise 2' }),
    ];

    workouts = [
      generateWorkout({
        id: '1',
        name: 'Test Workout',
        exercises: [{ id: '1', exerciseId: '1', sets: 1 }],
      }),
    ];

    useExercisesStore.setState({
      exercises,
    });

    useWorkoutsStore.setState({
      workouts,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should start waiting for user to be ready', () => {
    const { result } = renderHook(() => useRunningSession('1'));

    advanceTimeInSeconds(3);

    expect(result.current.time).toBe(3);
    expect(result.current.events).toEqual([
      { type: 'waiting-for-user-to-be-ready', time: 0 },
    ]);

    expect(result.current.exercisesLeftToDo).toEqual([
      workouts[0].exercises[0],
    ]);
  });

  test('should start counting down when user is ready', () => {
    const { result } = renderHook(() => useRunningSession('1'));

    advanceTimeInSeconds(3);

    act(() => {
      result.current.readyForNextRepetition();
    });

    expect(result.current.time).toBe(TimeBetweenExercisesInSeconds);
    expect(result.current.events).toEqual([
      { type: 'waiting-for-user-to-be-ready', time: 0 },
      { type: 'counting-down-when-ready', time: 3 },
    ]);
  });

  test('should start exercise when counting down is finished', () => {
    const { result } = renderHook(() => useRunningSession('1'));

    advanceTimeInSeconds(3);

    act(() => {
      result.current.readyForNextRepetition();
    });

    advanceTimeInSeconds(TimeBetweenExercisesInSeconds);

    expect(result.current.time).toBe(0);
    expect(result.current.events.at(-1)).toEqual({
      type: 'starting-exercise',
      time: 18,
    });
  });

  test('should finish set', () => {
    const { result } = renderHook(() => useRunningSession('1'));
    act(() => {
      result.current.readyForNextRepetition();
    });

    advanceTimeInSeconds(20);

    act(() => {
      result.current.setIsFinished();
    });

    expect(result.current.events.at(-1)).toEqual({
      type: 'finished-set',
      time: 20,
    });
  });

  test('should set done repetitions for set', () => {
    const { result } = renderHook(() => useRunningSession('1'));
    act(() => {
      result.current.readyForNextRepetition();
    });

    advanceTimeInSeconds(20);

    act(() => {
      result.current.setIsFinished();
      result.current.repetitionsAreSet(3);
    });

    expect(result.current.events.at(-2)).toEqual({
      type: 'setting-repetitions',
      exerciseId: '1',
      repetitions: 3,
      time: 20,
    });

    expect(result.current.events.at(-1)).toEqual({
      type: 'finishing-workout',
      time: 20,
    });
    expect(result.current.exercisesLeftToDo).toEqual([]);
  });

  test('should start counting down when user is ready for consecutive sets', () => {
    workouts[0].exercises[0].sets = 2;

    const { result } = renderHook(() => useRunningSession('1'));
    act(() => {
      result.current.readyForNextRepetition();
    });

    advanceTimeInSeconds(TimeBetweenExercisesInSeconds + 1);

    act(() => {
      result.current.setIsFinished();
      result.current.repetitionsAreSet(3);
    });

    advanceTimeInSeconds(1);

    act(() => {
      result.current.readyForNextRepetition();
    });

    expect(result.current.time).toBe(TimeBetweenExercisesInSeconds - 1);
  });

  test('should start counting from 0 when default time is reached', () => {
    workouts[0].exercises[0].sets = 2;

    const { result } = renderHook(() => useRunningSession('1'));
    act(() => {
      result.current.readyForNextRepetition();
    });

    advanceTimeInSeconds(TimeBetweenExercisesInSeconds);

    act(() => {
      result.current.setIsFinished();
      result.current.repetitionsAreSet(3);
    });

    advanceTimeInSeconds(TimeBetweenExercisesInSeconds + 1);

    act(() => {
      result.current.readyForNextRepetition();
    });

    expect(result.current.time).toBe(0);
  });

  test('should decrease number of sets in exercisesLeftToDo when set is finished', () => {
    workouts[0].exercises[0].sets = 2;

    const { result } = renderHook(() => useRunningSession('1'));
    act(() => {
      result.current.readyForNextRepetition();
    });

    advanceTimeInSeconds(20);

    act(() => {
      result.current.setIsFinished();
      result.current.repetitionsAreSet(3);
    });

    expect(result.current.events.at(-1)).toEqual({
      type: 'waiting-for-user-to-be-ready',
      time: 20,
    });
    expect(result.current.exercisesLeftToDo).toEqual([
      { id: '1', exerciseId: '1', sets: 1 },
    ]);
  });

  test('should remove exercise from exercisesLeftToDo when all sets are done', () => {
    workouts[0].exercises = [
      { id: '1', exerciseId: '1', sets: 1 },
      { id: '2', exerciseId: '2', sets: 1 },
    ];

    const { result } = renderHook(() => useRunningSession('1'));
    act(() => {
      result.current.readyForNextRepetition();
    });

    advanceTimeInSeconds(20);

    act(() => {
      result.current.setIsFinished();
      result.current.repetitionsAreSet(3);
    });

    expect(result.current.events.at(-1)).toEqual({
      type: 'waiting-for-user-to-be-ready',
      time: 20,
    });
    expect(result.current.exercisesLeftToDo).toEqual([
      { id: '2', exerciseId: '2', sets: 1 },
    ]);
  });
});

// vi.advanceTimersByTime doesn't trigger setInterval callback for each second
function advanceTimeInSeconds(time: number) {
  for (let i = 0; i < time; i++) {
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  }
}
