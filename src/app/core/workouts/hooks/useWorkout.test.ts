import { renderHook, act } from '@testing-library/react';
import { useWorkout } from './useWorkout';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { generateWorkout } from '@/lib/test-utils';
import { v4 } from 'uuid';

// Mock the dependencies
vi.mock('@/app/core/exercises/hooks/useExercise');

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

describe('useWorkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useWorkoutsStore.setState({ workouts: [] });

    vi.mocked(useExercise).mockReturnValue({
      dispatchAddUsageExercise: vi.fn(),
      dispatchRemoveUsageExercise: vi.fn(),
    } as Partial<ReturnType<typeof useExercise>> as ReturnType<
      typeof useExercise
    >);
  });

  test('dispatchAdd should add a workout and update exercise usage', async () => {
    const id = 'workout-1';
    vi.mocked(v4).mockImplementation(() => id);

    const { result } = renderHook(() => useWorkout());

    const workoutForm = {
      name: 'New Workout',
      exercises: [
        { id: '1', exerciseId: 'ex1', sets: 1 },
        { id: '2', exerciseId: 'ex2', sets: 1 },
      ],
    };

    await act(async () => {
      await result.current.dispatchAddWorkout(workoutForm);
    });

    const storeState = useWorkoutsStore.getState();
    expect(storeState.workouts[0]).toMatchObject({
      ...workoutForm,
      id,
      position: 0,
    });
    expect(storeState.workouts).toHaveLength(1);
    expect(storeState.workouts[0].name).toBe('New Workout');
    expect(useExercise().dispatchAddUsageExercise).toHaveBeenCalledWith({
      exerciseId: 'ex1',
      userId: id,
    });
    expect(useExercise().dispatchAddUsageExercise).toHaveBeenCalledWith({
      exerciseId: 'ex2',
      userId: id,
    });
  });

  test('dispatchAdd should add a workout to existing workouts', async () => {
    const id = 'workout-2';
    vi.mocked(v4).mockImplementation(() => id);

    useWorkoutsStore.setState({
      workouts: [
        generateWorkout({
          id: 'workout-1',
          name: 'Initial Workout',
          exercises: [],
          position: 4,
        }),
      ],
    });
    const { result } = renderHook(() => useWorkout());

    const workoutForm = {
      name: 'New Workout',
      exercises: [{ id: '1', exerciseId: 'ex1', sets: 1 }],
    };

    await act(async () => {
      await result.current.dispatchAddWorkout(workoutForm);
    });

    const storeState = useWorkoutsStore.getState();
    expect(storeState.workouts[1]).toMatchObject({
      ...workoutForm,
      id,
      position: 5,
    });
  });

  test('dispatchUpdate should update a workout and update exercise usage', async () => {
    const initialWorkout = generateWorkout({
      id: '1',
      name: 'Initial Workout',
      exercises: [
        { id: '1', exerciseId: 'ex1', sets: 1 },
        { id: '2', exerciseId: 'ex2', sets: 1 },
        { id: '3', exerciseId: 'ex3', sets: 1 },
      ],
    });
    useWorkoutsStore.setState({ workouts: [initialWorkout] });

    const { result } = renderHook(() => useWorkout());
    const updatedWorkout = {
      ...initialWorkout,
      name: 'Updated Workout',
      exercises: [
        { id: '3', exerciseId: 'ex3', sets: 1 },
        { id: '4', exerciseId: 'ex4', sets: 1 },
        { id: '5', exerciseId: 'ex5', sets: 1 },
      ],
    };

    await act(async () => {
      await result.current.dispatchUpdateWorkout(updatedWorkout);
    });

    const storeState = useWorkoutsStore.getState();
    expect(storeState.workouts).toHaveLength(1);
    expect(storeState.workouts[0].name).toBe('Updated Workout');
    expect(useExercise().dispatchAddUsageExercise).toHaveBeenCalledWith({
      exerciseId: 'ex4',
      userId: '1',
    });
    expect(useExercise().dispatchAddUsageExercise).toHaveBeenCalledWith({
      exerciseId: 'ex5',
      userId: '1',
    });

    expect(useExercise().dispatchRemoveUsageExercise).toHaveBeenCalledWith({
      exerciseId: 'ex1',
      userId: '1',
    });
    expect(useExercise().dispatchRemoveUsageExercise).toHaveBeenCalledWith({
      exerciseId: 'ex2',
      userId: '1',
    });
  });

  describe('dispatchDelete', () => {
    test('dispatchDelete should delete a workout and update exercise usage', async () => {
      useWorkoutsStore.setState({
        workouts: [
          generateWorkout({
            id: '1',
            exercises: [
              { id: '1', exerciseId: 'ex1', sets: 1 },
              { id: '2', exerciseId: 'ex2', sets: 1 },
            ],
          }),
        ],
      });

      const { result } = renderHook(() => useWorkout());

      await act(async () => {
        await result.current.dispatchDeleteWorkout('1');
      });

      const storeState = useWorkoutsStore.getState();
      expect(storeState.workouts).toHaveLength(0);
      expect(useExercise().dispatchRemoveUsageExercise).toHaveBeenCalledWith({
        exerciseId: 'ex1',
        userId: '1',
      });
      expect(useExercise().dispatchRemoveUsageExercise).toHaveBeenCalledWith({
        exerciseId: 'ex2',
        userId: '1',
      });
    });
    test('should hide workout if there is usage', async () => {
      useWorkoutsStore.setState({
        workouts: [
          generateWorkout({
            id: '1',
            exercises: [{ id: '1', exerciseId: 'ex1', sets: 1 }],
            usage: [{ id: '3' }],
          }),
        ],
      });

      const { result } = renderHook(() => useWorkout());

      await act(async () => {
        await result.current.dispatchDeleteWorkout('1');
      });

      const storeState = useWorkoutsStore.getState();
      expect(storeState.workouts[0].hidden).toBe(true);
    });
  });

  test('dispatchSet should set workouts and update positions', async () => {
    const { result } = renderHook(() => useWorkout());
    const workouts = [
      generateWorkout({ id: '1', position: 1 }),
      generateWorkout({ id: '2', position: 0 }),
    ];

    await act(async () => {
      await result.current.dispatchSetWorkouts(workouts);
    });

    const storeState = useWorkoutsStore.getState();
    expect(storeState.workouts).toHaveLength(2);
    expect(storeState.workouts[0].position).toBe(0);
    expect(storeState.workouts[1].position).toBe(1);
  });

  test('should add usage', async () => {
    useWorkoutsStore.setState({
      workouts: [generateWorkout({ id: '1', usage: [] })],
    });

    const { result } = renderHook(() => useWorkout());

    await act(async () => {
      await result.current.dispatchAddUsageToWorkout('1', 'user-1');
    });

    expect(useWorkoutsStore.getState().workouts[0].usage[0]).toEqual({
      id: 'user-1',
    });
  });

  describe('removeUsage', () => {
    test('should remove usage', async () => {
      useWorkoutsStore.setState({
        workouts: [generateWorkout({ id: '1', usage: [{ id: 'user-1' }] })],
      });

      const { result } = renderHook(() => useWorkout());

      await act(async () => {
        await result.current.dispatchRemoveUsageFromWorkout('1', 'user-1');
      });

      expect(useWorkoutsStore.getState().workouts[0].usage).toHaveLength(0);
    });

    test('should delete workout if usage is empty and workout is hidden', async () => {
      useWorkoutsStore.setState({
        workouts: [
          generateWorkout({ id: '1', usage: [{ id: 'user-1' }], hidden: true }),
        ],
      });

      const { result } = renderHook(() => useWorkout());

      await act(async () => {
        await result.current.dispatchRemoveUsageFromWorkout('1', 'user-1');
      });

      expect(useWorkoutsStore.getState().workouts).toHaveLength(0);
    });
  });
});
