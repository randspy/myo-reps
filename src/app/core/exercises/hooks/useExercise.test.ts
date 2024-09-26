import { useExercise } from './useExercise';
import { v4 } from 'uuid';
import {
  ExerciseFormValues,
  ExerciseValue,
} from '@/app/core/exercises/exercises-types';
import { generateExercise } from '@/lib/test-utils';
import { act, renderHook } from '@testing-library/react';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

describe('useExercise', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    act(() => {
      useExercisesStore.getState().setExercises([]);
    });
  });

  test('should return exercises and activeExercises', () => {
    const exercises = [
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

    useExercisesStore.setState({ exercises });

    const { result } = renderHook(() => useExercise());

    expect(result.current.exercises).toEqual(exercises);
    expect(result.current.activeExercises).toEqual([exercises[0]]);
  });

  test('should add exercise', async () => {
    const id = 'exercise-1';
    vi.mocked(v4).mockImplementation(() => id);

    const { result } = renderHook(() => useExercise());
    const newExercise: ExerciseFormValues = { name: 'added exercise' };

    await act(async () => {
      await result.current.dispatchAdd(newExercise);
    });

    const storeState = useExercisesStore.getState();
    expect(storeState.exercises[0]).toEqual({
      ...newExercise,
      id,
      hidden: false,
      usage: [],
      position: 0,
    });
  });

  test('should add exercise to existing exercises', async () => {
    const id = 'exercise-2';
    vi.mocked(v4).mockImplementation(() => id);

    useExercisesStore.setState({
      exercises: [
        generateExercise({
          id: 'exercise-1',
          name: 'Push-up',
          position: 4,
        }),
      ],
    });

    const { result } = renderHook(() => useExercise());

    const newExercise: ExerciseFormValues = { name: 'added exercise' };

    await act(async () => {
      await result.current.dispatchAdd(newExercise);
    });

    const storeState = useExercisesStore.getState();
    expect(storeState.exercises[1]).toMatchObject({
      ...newExercise,
      id,
      position: 5,
    });
  });

  test('should dispatch updateExercise action', async () => {
    useExercisesStore.setState({
      exercises: [generateExercise({ id: 'exercise-1' })],
    });

    const { result } = renderHook(() => useExercise());

    const updatedExercise: ExerciseValue = generateExercise({
      id: 'exercise-1',
      name: 'Updated Exercise',
    });

    await act(async () => {
      await result.current.dispatchUpdate(updatedExercise);
    });

    expect(exercise('exercise-1')).toEqual(updatedExercise);
  });

  test('should set exercises', async () => {
    const { result } = renderHook(() => useExercise());

    const exercises = [
      generateExercise({ id: 'exercise-1', position: 1 }),
      generateExercise({ id: 'exercise-2', position: 0 }),
    ];

    await act(async () => {
      await result.current.dispatchSet(exercises);
    });

    const storeState = useExercisesStore.getState();
    expect(storeState.exercises).toEqual(
      exercises.map((exercise, idx) => ({ ...exercise, position: idx })),
    );
  });

  describe('delete exercise', () => {
    test('should hide if exercise is in use', async () => {
      useExercisesStore.setState({
        exercises: [
          generateExercise({
            id: 'exercise-1',
            usage: [{ id: 'workout-1' }],
          }),
        ],
      });

      const { result } = renderHook(() => useExercise());

      await act(async () => {
        await result.current.dispatchDelete('exercise-1');
      });

      expect(exercise('exercise-1')).toEqual(
        generateExercise({
          id: 'exercise-1',
          usage: [{ id: 'workout-1' }],
          hidden: true,
        }),
      );
    });

    test('should delete action if exercise is not in use', async () => {
      useExercisesStore.setState({
        exercises: [
          generateExercise({
            id: 'exercise-1',
            usage: [],
          }),
        ],
      });

      const { result } = renderHook(() => useExercise());

      await act(async () => {
        await result.current.dispatchDelete('exercise-1');
      });

      const storeState = useExercisesStore.getState();
      expect(storeState.exercises.length).toEqual(0);
    });
  });

  test('should add usage', async () => {
    useExercisesStore.setState({
      exercises: [generateExercise({ id: 'exercise-1' })],
    });

    const { result } = renderHook(() => useExercise());

    await act(async () => {
      await result.current.dispatchAddUsage({
        exerciseId: 'exercise-1',
        userId: '1',
      });
    });

    expect(exercise('exercise-1')).toEqual(
      generateExercise({
        id: 'exercise-1',
        usage: [{ id: '1' }],
      }),
    );
  });

  describe('remove usage', () => {
    test('should remove usage', async () => {
      useExercisesStore.setState({
        exercises: [
          generateExercise({
            id: 'exercise-1',
            usage: [{ id: '1' }],
          }),
        ],
      });

      const { result } = renderHook(() => useExercise());

      await act(async () => {
        await result.current.dispatchRemoveUsage({
          exerciseId: 'exercise-1',
          userId: '1',
        });
      });

      expect(exercise('exercise-1')).toEqual(
        generateExercise({
          id: 'exercise-1',
          usage: [],
        }),
      );
    });

    test('should delete exercise if exercise is hidden and has no usage outside provided user id', async () => {
      useExercisesStore.setState({
        exercises: [
          generateExercise({
            id: 'exercise-1',
            usage: [{ id: '1' }],
            hidden: true,
          }),
        ],
      });

      const { result } = renderHook(() => useExercise());

      await act(async () => {
        await result.current.dispatchRemoveUsage({
          exerciseId: 'exercise-1',
          userId: '1',
        });
      });

      const storeState = useExercisesStore.getState();
      expect(storeState.exercises.length).toEqual(0);
    });
  });
});

function exercise(id: string) {
  return useExercisesStore
    .getState()
    .exercises.find((exercise: ExerciseValue) => exercise.id === id);
}
