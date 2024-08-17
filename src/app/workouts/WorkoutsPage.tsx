import { cn } from '@/lib/utils';
import { AddNewWorkoutDialog } from './AddNewWorkoutDialog';

export const WorkoutsPage: React.FC = () => {
  return (
    <div className={cn('my-8 flex h-full flex-col items-center px-2')}>
      <AddNewWorkoutDialog />
    </div>
  );
};
