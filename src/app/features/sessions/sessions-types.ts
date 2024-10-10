export interface SessionValue {
  id: string;
  workoutId: string;
  startDate: Date;
  events: SessionEvent[];
}

export type SessionEvent = {
  type:
    | 'waiting-for-user-to-be-ready'
    | 'counting-down-when-ready'
    | 'starting-exercise'
    | 'finished-set'
    | 'setting-repetitions'
    | 'finishing-workout';
  repetitions?: number;
  exerciseId?: string;
  time?: number;
};
