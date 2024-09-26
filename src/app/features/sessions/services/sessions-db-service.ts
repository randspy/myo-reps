import { db } from '@/db';
import { SessionValue } from '@/app/features/sessions/sessions-types';

export const SessionsDbService = {
  add: async (session: SessionValue) => {
    await db.sessions.add(session);
  },

  delete: async (id: string) => {
    await db.sessions.delete(id);
  },
};
