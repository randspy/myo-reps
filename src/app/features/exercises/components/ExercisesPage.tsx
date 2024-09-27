import { Link } from 'react-router-dom';
import { ExerciseList } from '@/app/features/exercises/components/ExerciseList';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { selectAllExercises } from '@/app/core/exercises/store/exercises-selectors';

export const ExercisesPage = () => {
  const exercises = selectAllExercises();

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
