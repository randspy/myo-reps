import { SessionsDbService } from '@/app/features/sessions/services/sessions-db-service';
import { SessionValue } from '@/app/features/sessions/sessions-types';
import { useSessionsStore } from '../store/sessions-store';

export const useSessionActions = () => {
  const { addSession, deleteSession } = useSessionsStore();

  const addSessionWithPersistence = async (session: SessionValue) => {
    await SessionsDbService.add(session);
    addSession(session);
  };

  const deleteSessionWithPersistence = async (id: string) => {
    await SessionsDbService.delete(id);
    deleteSession(id);
  };

  return {
    addSession: addSessionWithPersistence,
    deleteSession: deleteSessionWithPersistence,
  };
};
