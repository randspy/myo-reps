import { create } from 'zustand';
import { SessionValue } from '@/app/features/sessions/sessions-types';
import { devtools } from 'zustand/middleware';
import { sortSessions } from '@/app/features/sessions/domain/sessions-domain';
import { db } from '@/db';

export interface SessionsState {
  sessions: SessionValue[];
  isInitialized: boolean;
  restoreSessions: () => Promise<void>;
  addSession: (session: SessionValue) => void;
  deleteSession: (id: string) => void;
}

export const useSessionsStore = create<
  SessionsState,
  [['zustand/devtools', never]]
>(
  devtools((set) => ({
    sessions: [],
    isInitialized: false,
    restoreSessions: async () => {
      if (!useSessionsStore.getState().isInitialized) {
        const sessions = await db.sessions.toArray();
        set({ sessions: sortSessions(sessions), isInitialized: true });
      }
    },
    addSession: (session: SessionValue) => {
      set((state) => ({ sessions: [...state.sessions, session] }));
    },
    deleteSession: (id: string) => {
      set((state) => ({
        sessions: state.sessions.filter((session) => session.id !== id),
      }));
    },
  })),
);

useSessionsStore.getState().restoreSessions();
