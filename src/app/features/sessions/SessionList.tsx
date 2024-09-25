import { selectAllSessions } from '@/app/features/sessions/store/sessions-selector';
import { selectWorkoutsAsMap } from '@/app/core/workouts/store/workouts-selectors';
import { Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SessionList: React.FC = () => {
  const sessions = selectAllSessions();
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
          <span className="mt-1 text-xs text-muted-foreground">
            {session.startDate.toLocaleTimeString()}
          </span>
          <Button
            className="ml-auto"
            variant="icon"
            size="icon"
            aria-label="Delete session"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {!sessions.length && (
        <p className="m-auto text-muted-foreground">No sessions</p>
      )}
    </div>
  );
};
