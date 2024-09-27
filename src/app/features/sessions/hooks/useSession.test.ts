import { renderHook, act } from '@testing-library/react';
import { useSession } from './useSession';
import { useSessionsStore } from '@/app/features/sessions/store/sessions-store';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { generateSession } from '@/lib/test-utils';
import { useWorkout } from '@/app/core/workouts/hooks/useWorkout';

vi.mock('@/app/core/workouts/hooks/useWorkout');

describe('useSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSessionsStore.setState({ sessions: [] });
    useWorkoutsStore.setState({ workouts: [] });

    vi.mocked(useWorkout).mockReturnValue({
      dispatchAddUsageToWorkout: vi.fn(),
      dispatchRemoveUsageFromWorkout: vi.fn(),
    } as Partial<ReturnType<typeof useWorkout>> as ReturnType<
      typeof useWorkout
    >);
  });

  test('should add a session', async () => {
    const { result } = renderHook(() => useSession());
    const newSession = generateSession({ id: '1', workoutId: 'workout1' });

    await act(async () => {
      await result.current.addSession(newSession);
    });

    expect(useSessionsStore.getState().sessions).toContain(newSession);
    expect(useWorkout().dispatchAddUsageToWorkout).toHaveBeenCalledWith(
      'workout1',
      '1',
    );
  });

  test('should delete a session', async () => {
    const session = generateSession({ id: '1', workoutId: 'workout1' });
    useSessionsStore.setState({ sessions: [session] });

    const { result } = renderHook(() => useSession());

    await act(async () => {
      await result.current.deleteSession(session.id);
    });

    expect(useSessionsStore.getState().sessions).not.toContain(session);
    expect(useWorkout().dispatchRemoveUsageFromWorkout).toHaveBeenCalledWith(
      'workout1',
      '1',
    );
  });
});
