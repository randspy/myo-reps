import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { selectExercisesByWorkoutIdAsMap } from '@/app/core/exercises/exercises-selectors';
import { selectWorkoutById } from '@/app/core/workouts/workouts-selectors';
import { PageNotFound } from '@/app/layout/PageNotFound';
import { FormCard } from '@/app/ui/FormCard';
import { Button } from '@/components/ui/button';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

export const StartSessionPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workoutId = searchParams.get('workoutId');

  const workout = useSelector(selectWorkoutById(workoutId));
  const exercises = useSelector<RootState, Map<string, ExerciseValue>>(
    selectExercisesByWorkoutIdAsMap(workoutId),
  );

  if (!workout) {
    return <PageNotFound />;
  }

  return (
    <FormCard title={`Start Session for ${workout.name}`}>
      {workout.exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="my-2 flex items-center justify-between"
        >
          <p className="truncate">{exercises.get(exercise.exerciseId)?.name}</p>
          <div className="min-w-10 bg-primary p-2 text-center text-primary-foreground">
            {exercise.sets}
          </div>
        </div>
      ))}

      <div className="mt-8 flex flex-col gap-2">
        <Button asChild className="bg-teal-800">
          <Link to="/sessions/in-progress">Start Session</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/workouts">Cancel</Link>
        </Button>
      </div>
    </FormCard>
  );
};
