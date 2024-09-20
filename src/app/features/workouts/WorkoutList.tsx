import { DeleteWorkoutDialog } from './DeleteWorkoutDialog';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlayIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWorkout } from '@/app/core/workouts/hooks/useWorkout';
import { DragAndDropList } from '@/app/ui/DragAndDropList';
import { DragAndDropListItem } from '@/app/ui/DragAndDropListItem';
import { canStartWorkout } from '@/app/core/workouts/domain/workout.domain';

export const WorkoutList: React.FC = () => {
  const { workouts, dispatchSet } = useWorkout();

  return (
    <div className="w-full">
      <DragAndDropList
        values={workouts}
        onReorder={async (values) => await dispatchSet(values)}
      >
        {workouts?.map((workout) => (
          <DragAndDropListItem key={workout.id} value={workout}>
            <h3 className="mr-auto truncate">{workout.name}</h3>

            {canStartWorkout(workout) && (
              <Button asChild variant="icon" size="icon">
                <Link
                  to={`/sessions/new?workoutId=${workout.id}`}
                  aria-label="Start workout"
                >
                  <PlayIcon className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button asChild variant="icon" size="icon">
              <Link to={`/workouts/${workout.id}`} aria-label="Edit workout">
                <PencilIcon className="h-4 w-4" />
              </Link>
            </Button>

            <DeleteWorkoutDialog workout={workout} />
          </DragAndDropListItem>
        ))}
      </DragAndDropList>
    </div>
  );
};
