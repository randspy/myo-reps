import { createSelector } from 'reselect';
import { SessionsState, useSessionsStore } from './sessions-store';
import { sortSessions } from '../domain/sessions.domain';

export const selectAllSessions = () =>
  useSessionsStore((state) => state.sessions);

export const selectSortedSessions = () =>
  useSessionsStore(
    createSelector(
      (state: SessionsState) => state.sessions,
      (sessions) => sortSessions(sessions),
    ),
  );

export const selectSessionById = (id: string | undefined | null) =>
  useSessionsStore(
    createSelector(
      (state: SessionsState) => state.sessions,
      (sessions) => sessions.find((session) => session.id === id),
    ),
  );
