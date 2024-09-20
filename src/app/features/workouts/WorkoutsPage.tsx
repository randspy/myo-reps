import { cn } from '@/lib/utils';
import { WorkoutList } from '@/app/features/workouts/WorkoutList';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { selectAllWorkouts } from '@/app/core/workouts/store/workouts-selectors';

export const WorkoutsPage: React.FC = () => {
  const workouts = selectAllWorkouts();

  return (
    <div
      className={cn(
        'my-8 flex h-full flex-col items-center px-2',
        workouts.length === 0 && 'justify-center',
      )}
      data-testid="workouts-page-container"
    >
      <Button asChild className="w-full md:w-fit">
        <Link to="/workouts/new">Add New Workout</Link>
      </Button>
      <div className="mt-8 w-full">
        <WorkoutList />
      </div>
    </div>
  );
};
