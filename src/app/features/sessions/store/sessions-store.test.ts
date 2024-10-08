import { useSessionsStore } from '@/app/features/sessions/store/sessions-store';
import { act, renderHook } from '@testing-library/react';
import { SessionValue } from '@/app/features/sessions/sessions-types';
import { generateSession } from '@/lib/test-utils';
import { db } from '@/db';

describe('useSessionsStore', () => {
  beforeEach(() => {
    act(() => {
      useSessionsStore.setState({ sessions: [], isInitialized: false });
    });
  });

  it('should initialize with an empty sessions array', () => {
    const { result } = renderHook(() => useSessionsStore());
    expect(result.current.sessions).toEqual([]);
  });

  it('should restore sessions and sort them by startDate from newest to oldest', async () => {
    const sessions: SessionValue[] = [
      generateSession({
        id: '1',
        workoutId: 'w1',
        startDate: new Date('2023-05-01'),
        events: [],
      }),
      generateSession({
        id: '2',
        workoutId: 'w2',
        startDate: new Date('2023-05-03'),
        events: [],
      }),
      generateSession({
        id: '3',
        workoutId: 'w3',
        startDate: new Date('2023-05-02'),
        events: [],
      }),
    ];

    vi.mocked(db.sessions.toArray).mockResolvedValue(sessions);

    const { result } = renderHook(() => useSessionsStore());

    await act(async () => {
      await result.current.restoreSessions();
    });

    expect(result.current.sessions).toEqual([
      generateSession({
        id: '2',
        workoutId: 'w2',
        startDate: new Date('2023-05-03'),
        events: [],
      }),
      generateSession({
        id: '3',
        workoutId: 'w3',
        startDate: new Date('2023-05-02'),
        events: [],
      }),
      generateSession({
        id: '1',
        workoutId: 'w1',
        startDate: new Date('2023-05-01'),
        events: [],
      }),
    ]);
  });

  it('should add a new session', () => {
    const { result } = renderHook(() => useSessionsStore());
    const newSession: SessionValue = generateSession({
      id: '1',
      workoutId: 'w1',
      startDate: new Date(),
      events: [],
    });

    act(() => {
      result.current.addSession(newSession);
    });

    expect(result.current.sessions).toEqual([newSession]);
  });

  it('should delete a session by id', () => {
    const sessions: SessionValue[] = [
      generateSession({
        id: '1',
        workoutId: 'w1',
        startDate: new Date(),
        events: [],
      }),
      generateSession({
        id: '2',
        workoutId: 'w2',
        startDate: new Date(),
        events: [],
      }),
    ];

    useSessionsStore.setState({ sessions });

    const { result } = renderHook(() => useSessionsStore());

    act(() => {
      result.current.deleteSession('1');
    });

    expect(result.current.sessions).toEqual([sessions[1]]);
  });
});
