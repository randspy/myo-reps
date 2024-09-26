import { selectExerciseByWorkoutIdAsMap } from '@/app/core/exercises/store/exercises-selectors';
import { selectWorkoutById } from '@/app/core/workouts/store/workouts-selectors';
import { PageNotFound } from '@/app/ui/PageNotFound';
import { FormCard } from '@/app/ui/FormCard';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
export const StartSessionPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workoutId = searchParams.get('workoutId');

  const workout = selectWorkoutById(workoutId);
  const exercises = selectExerciseByWorkoutIdAsMap(workoutId);

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
          <div className="min-w-12 border p-2 text-center">{exercise.sets}</div>
        </div>
      ))}

      <div className="mt-8 flex flex-col gap-2">
        <Button asChild className="bg-primary">
          <Link to={`/sessions/in-progress?workoutId=${workout.id}`}>
            Start Session
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/workouts">Cancel</Link>
        </Button>
      </div>
    </FormCard>
  );
};
