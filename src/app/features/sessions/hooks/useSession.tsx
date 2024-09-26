import { useWorkout } from '@/app/core/workouts/hooks/useWorkout';
import { useSessionActions } from '@/app/features/sessions/hooks/useSessionActions';
import { SessionValue } from '@/app/features/sessions/sessions-types';
import { selectAllSessions } from '@/app/features/sessions/store/sessions-selector';

export const useSession = () => {
  const { addSession, deleteSession } = useSessionActions();
  const { addUsage, removeUsage } = useWorkout();
  const sessions = selectAllSessions();

  const dispatchAddSession = async (session: SessionValue) => {
    await addSession(session);
    await addUsage(session.workoutId, session.id);
  };

  const dispatchDeleteSession = async (id: string) => {
    await deleteSession(id);

    const session = sessions.find((session) => session.id === id);

    if (session) {
      await removeUsage(session.workoutId, id);
    }
  };

  return {
    addSession: dispatchAddSession,
    deleteSession: dispatchDeleteSession,
  };
};
