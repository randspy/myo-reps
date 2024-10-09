import { renderHook, act } from '@testing-library/react';
import { useSessionPersistence } from './useSessionPersistence';
import { useSessionsStore } from '@/app/features/sessions/store/sessions-store';
import { generateSession } from '@/lib/test-utils';
import { db } from '@/db';

describe('useSessionPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSessionsStore.setState({ sessions: [] });
  });

  test('should add a session', async () => {
    const { result } = renderHook(() => useSessionPersistence());
    const newSession = generateSession({ id: '1', workoutId: 'workout1' });

    await act(async () => {
      await result.current.addSession(newSession);
    });

    expect(db.sessions.add).toHaveBeenCalledWith(newSession);
    expect(useSessionsStore.getState().sessions).toContain(newSession);
  });

  test('should delete a session', async () => {
    const session = generateSession({ id: '1', workoutId: 'workout1' });
    useSessionsStore.setState({ sessions: [session] });

    const { result } = renderHook(() => useSessionPersistence());

    await act(async () => {
      await result.current.deleteSession(session.id);
    });

    expect(db.sessions.delete).toHaveBeenCalledWith(session.id);
    expect(useSessionsStore.getState().sessions).not.toContain(session);
  });
});
