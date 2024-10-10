import { createSelector } from 'reselect';
import { SessionsState, useSessionsStore } from './sessions-store';
import { sortSessions } from '../domain/sessions-domain';

export const selectAllSessions = () =>
  useSessionsStore((state) => state.sessions);

export const selectSortedSessions = () =>
  useSessionsStore(
    createSelector(
      (state: SessionsState) => state.sessions,
      (sessions) => sortSessions(sessions),
    ),
  );
