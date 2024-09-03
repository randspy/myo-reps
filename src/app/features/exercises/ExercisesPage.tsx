import { Link } from 'react-router-dom';
import { ExerciseList } from '@/app/features/exercises/ExerciseList';
import { cn } from '@/lib/utils';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { Button } from '@/components/ui/button';

export const ExercisesPage = () => {
  const { exercises } = useExercise();

  return (
    <div
      className={cn(
        'my-8 flex h-full flex-col items-center px-2',
        exercises.length === 0 && 'justify-center',
      )}
      data-testid="exercises-page-container"
    >
      <Button asChild className="w-full md:w-fit">
        <Link to="/exercises/new">Add New Exercise</Link>
      </Button>

      <div className="mt-8 w-full">
        <ExerciseList />
      </div>
    </div>
  );
};
