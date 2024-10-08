import { useWorkout } from '@/app/core/workouts/hooks/useWorkout';
import { useSessionPersistence } from '@/app/features/sessions/hooks/useSessionPersistence';
import { SessionValue } from '@/app/features/sessions/sessions-types';
import { selectAllSessions } from '@/app/features/sessions/store/sessions-selector';

export const useSession = () => {
  const { addSession, deleteSession } = useSessionPersistence();
  const { dispatchAddUsageToWorkout, dispatchRemoveUsageFromWorkout } =
    useWorkout();
  const sessions = selectAllSessions();

  const dispatchAddSession = async (session: SessionValue) => {
    await addSession(session);
    await dispatchAddUsageToWorkout(session.workoutId, session.id);
  };

  const dispatchDeleteSession = async (id: string) => {
    await deleteSession(id);

    const session = sessions.find((session) => session.id === id);

    if (session) {
      await dispatchRemoveUsageFromWorkout(session.workoutId, id);
    }
  };

  return {
    dispatchAddSession,
    dispatchDeleteSession,
  };
};
