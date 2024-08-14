import { AddNewExerciseDialog } from './AddNewExerciseDialog';
import { useAppSelector } from '@/app/hooks';
import { ExerciseList } from '@/app/exercises/ExerciseList';
import { cn } from '@/lib/utils';

export const ExercisesPage = () => {
  const exercises = useAppSelector((state) => state.exercises.values);

  return (
    <div
      className={cn(
        'my-8 flex h-full flex-col items-center px-2',
        exercises.length === 0 && 'justify-center',
      )}
    >
      <AddNewExerciseDialog />
      <div className="mt-8 w-full">
        <ExerciseList exercises={exercises} />
      </div>
    </div>
  );
};
