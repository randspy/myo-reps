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
      dispatchAddUsage: vi.fn(),
      dispatchRemoveUsage: vi.fn(),
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
      await result.current.dispatchAdd(workoutForm);
    });

    const storeState = useWorkoutsStore.getState();
    expect(storeState.workouts[0]).toMatchObject({
      ...workoutForm,
      id,
      position: 0,
    });
    expect(storeState.workouts).toHaveLength(1);
    expect(storeState.workouts[0].name).toBe('New Workout');
    expect(useExercise().dispatchAddUsage).toHaveBeenCalledWith({
      exerciseId: 'ex1',
      userId: id,
    });
    expect(useExercise().dispatchAddUsage).toHaveBeenCalledWith({
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
      await result.current.dispatchAdd(workoutForm);
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
      exercises: [],
    });
    useWorkoutsStore.setState({ workouts: [initialWorkout] });

    const { result } = renderHook(() => useWorkout());
    const updatedWorkout = {
      ...initialWorkout,
      name: 'Updated Workout',
      exercises: [
        { id: '1', exerciseId: 'ex1', sets: 1 },
        { id: '2', exerciseId: 'ex2', sets: 1 },
      ],
    };

    await act(async () => {
      await result.current.dispatchUpdate(updatedWorkout);
    });

    const storeState = useWorkoutsStore.getState();
    expect(storeState.workouts).toHaveLength(1);
    expect(storeState.workouts[0].name).toBe('Updated Workout');
    expect(useExercise().dispatchAddUsage).toHaveBeenCalledWith({
      exerciseId: 'ex1',
      userId: '1',
    });
    expect(useExercise().dispatchAddUsage).toHaveBeenCalledWith({
      exerciseId: 'ex2',
      userId: '1',
    });
  });

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
      await result.current.dispatchDelete('1');
    });

    const storeState = useWorkoutsStore.getState();
    expect(storeState.workouts).toHaveLength(0);
    expect(useExercise().dispatchRemoveUsage).toHaveBeenCalledWith({
      exerciseId: 'ex1',
      userId: '1',
    });
    expect(useExercise().dispatchRemoveUsage).toHaveBeenCalledWith({
      exerciseId: 'ex2',
      userId: '1',
    });
  });

  test('dispatchSet should set workouts and update positions', async () => {
    const { result } = renderHook(() => useWorkout());
    const workouts = [
      generateWorkout({ id: '1', position: 1 }),
      generateWorkout({ id: '2', position: 0 }),
    ];

    await act(async () => {
      await result.current.dispatchSet(workouts);
    });

    const storeState = useWorkoutsStore.getState();
    expect(storeState.workouts).toHaveLength(2);
    expect(storeState.workouts[0].position).toBe(0);
    expect(storeState.workouts[1].position).toBe(1);
  });
});
