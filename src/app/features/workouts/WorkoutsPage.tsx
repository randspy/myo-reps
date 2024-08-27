import { cn } from '@/lib/utils';
import { AddNewWorkoutDialog } from './AddNewWorkoutDialog';
import { WorkoutList } from '@/app/features/workouts/WorkoutList';
import { useAppSelector } from '@/store/hooks';

export const WorkoutsPage: React.FC = () => {
  const workouts = useAppSelector((state) => state.workouts.values);

  return (
    <div
      className={cn(
        'my-8 flex h-full flex-col items-center px-2',
        workouts.length === 0 && 'justify-center',
      )}
      data-testid="workouts-page-container"
    >
      <AddNewWorkoutDialog />
      <div className="mt-8 w-full">
        <WorkoutList />
      </div>
    </div>
  );
};
