import { create } from 'zustand';
import { SessionValue } from '@/app/features/sessions/session-schema';
import { devtools } from 'zustand/middleware';
import { sortSessions } from '@/app/features/sessions/domain/sessions.domain';

export interface SessionsState {
  sessions: SessionValue[];
  restoreSessions: (sessions: SessionValue[]) => void;
  addSession: (session: SessionValue) => void;
  deleteSession: (id: string) => void;
}

export const useSessionsStore = create<
  SessionsState,
  [['zustand/devtools', never]]
>(
  devtools((set) => ({
    sessions: [],
    restoreSessions: (sessions: SessionValue[]) => {
      set({
        sessions: sortSessions(sessions),
      });
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
