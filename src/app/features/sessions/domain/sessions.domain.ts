import { v4 as uuidv4 } from 'uuid';
import {
  SessionEvent,
  SessionValue,
} from '@/app/features/sessions/session-schema';

export const createSession = (
  workoutId: string,
  events: SessionEvent[],
): SessionValue => {
  return {
    id: uuidv4(),
    workoutId,
    startDate: new Date(),
    events,
  };
};
