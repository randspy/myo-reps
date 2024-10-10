import { describe, it, expect } from 'vitest';
import { createSession, sortSessions } from './sessions-domain';
import { SessionValue } from '@/app/features/sessions/sessions-types';
import { v4 } from 'uuid';
describe('sessions-domain', () => {
  describe('createSession', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('creates a session with the correct properties', () => {
      vi.mocked(v4).mockImplementation(() => 'mock-uuid');
      const workoutId = 'workout123';
      const events = [{ type: 'waiting-for-user-to-be-ready' as const }];

      const session = createSession(workoutId, events);

      expect(session).toEqual({
        id: 'mock-uuid',
        workoutId,
        startDate: expect.any(Date),
        events,
      });
    });
  });

  describe('sortSessions', () => {
    it('sorts sessions by startDate in descending order', () => {
      const sessions: SessionValue[] = [
        {
          id: '1',
          workoutId: 'workout1',
          startDate: new Date('2023-04-01T10:00:00'),
          events: [],
        },
        {
          id: '2',
          workoutId: 'workout2',
          startDate: new Date('2023-04-03T11:00:00'),
          events: [],
        },
        {
          id: '3',
          workoutId: 'workout3',
          startDate: new Date('2023-04-02T12:00:00'),
          events: [],
        },
      ];

      const sortedSessions = sortSessions(sessions);

      expect(sortedSessions).toEqual([
        sessions[1], // 2023-04-03
        sessions[2], // 2023-04-02
        sessions[0], // 2023-04-01
      ]);
    });

    it('returns an empty array when given an empty array', () => {
      const sessions: SessionValue[] = [];

      const sortedSessions = sortSessions(sessions);

      expect(sortedSessions).toEqual([]);
    });
  });
});
