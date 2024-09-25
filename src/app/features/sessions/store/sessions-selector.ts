import { createSelector } from 'reselect';
import { SessionsState, useSessionsStore } from './sessions-store';

export const selectAllSessions = () =>
  useSessionsStore((state) => state.sessions);

export const selectSessionById = (id: string | undefined | null) =>
  useSessionsStore(
    createSelector(
      (state: SessionsState) => state.sessions,
      (sessions) => sessions.find((session) => session.id === id),
    ),
  );
