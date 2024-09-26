import { selectSortedSessions } from '@/app/features/sessions/store/sessions-selector';
import { selectWorkoutsAsMap } from '@/app/core/workouts/store/workouts-selectors';
import { DeleteSessionDialog } from './DeleteSessionDialog';

export const SessionList: React.FC = () => {
  const sessions = selectSortedSessions();
  const workouts = selectWorkoutsAsMap();

  return (
    <div className="flex h-full w-full flex-col items-center">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="my-1 flex w-full items-center gap-2 bg-background-secondary p-5 pr-2 shadow-sm focus-within:shadow-md hover:shadow-md md:w-128"
        >
          <h3>{workouts.get(session.workoutId)?.name}</h3>
          <span className="mt-1 text-xs text-muted-foreground">
            {session.startDate.toLocaleDateString()}
          </span>
          <span className="mr-auto mt-1 text-xs text-muted-foreground">
            {session.startDate.toLocaleTimeString()}
          </span>
          <DeleteSessionDialog session={session} />
        </div>
      ))}
      {!sessions.length && (
        <p className="m-auto text-muted-foreground">No sessions</p>
      )}
    </div>
  );
};
