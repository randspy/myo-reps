import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DeleteWorkoutDialog } from './DeleteWorkoutDialog';
import { Reorder } from 'framer-motion';
import { setWorkouts } from '@/app/core/workouts/workouts-slice';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlayIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkoutList: React.FC = () => {
  const workouts = useAppSelector((state) => state.workouts.values);
  const dispatch = useAppDispatch();

  return (
    <div className="w-full">
      <Reorder.Group
        className="flex flex-col items-center"
        values={workouts}
        onReorder={(values) => dispatch(setWorkouts(values))}
      >
        {workouts?.map((workout) => (
          <Reorder.Item
            key={workout.id}
            value={workout}
            className="my-1 flex w-full items-center bg-background-secondary p-5 pr-2 shadow-sm md:w-128"
          >
            <h3 className="mr-auto truncate">{workout.name}</h3>

            <Button asChild variant="icon" size="icon">
              <Link
                to={`/sessions/new?workoutId=${workout.id}`}
                aria-label="Start workout"
              >
                <PlayIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="icon" size="icon">
              <Link to={`/workouts/${workout.id}`} aria-label="Edit workout">
                <PencilIcon className="h-4 w-4" />
              </Link>
            </Button>

            <DeleteWorkoutDialog workout={workout} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
