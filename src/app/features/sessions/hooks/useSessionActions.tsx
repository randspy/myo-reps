import { SessionValue } from '@/app/features/sessions/sessions-types';
import { useSessionsStore } from '@/app/features/sessions/store/sessions-store';
import { db } from '@/db';

export const useSessionActions = () => {
  const { addSession, deleteSession } = useSessionsStore();

  const addSessionWithPersistence = async (session: SessionValue) => {
    await db.sessions.add(session);
    addSession(session);
  };

  const deleteSessionWithPersistence = async (id: string) => {
    await db.sessions.delete(id);
    deleteSession(id);
  };

  return {
    addSession: addSessionWithPersistence,
    deleteSession: deleteSessionWithPersistence,
  };
};
