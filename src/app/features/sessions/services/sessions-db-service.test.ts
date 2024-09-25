import { SessionsDbService } from './sessions-db-service';
import { SessionValue } from '@/app/features/sessions/session-schema';
import { db } from '@/db';
import { generateSession } from '@/lib/test-utils';

describe('SessionsDbService', () => {
  const mockSession: SessionValue = generateSession({
    id: '1',
    workoutId: 'workout1',
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should add a session', async () => {
    await SessionsDbService.add(mockSession);
    expect(db.sessions.add).toHaveBeenCalledWith(mockSession);
  });

  test('should delete a session', async () => {
    const sessionId = '1';
    await SessionsDbService.delete(sessionId);
    expect(db.sessions.delete).toHaveBeenCalledWith(sessionId);
  });
});
