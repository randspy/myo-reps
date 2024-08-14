import { AddNewExerciseDialog } from './AddNewExerciseDialog';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addExercise } from '@/features/exercises/exercises-slice';
import { NewExerciseFormValues } from '@/features/exercises/exercises-schema';

export function Exercises() {
  const exercises = useAppSelector((state) => state.exercises.values);
  const dispatch = useAppDispatch();

  const submit = (values: NewExerciseFormValues) => {
    dispatch(addExercise(values));
  };

  return (
    <div className="flex h-full flex-col items-center">
      <AddNewExerciseDialog onSubmit={submit} />
      <ul className="space-y-4">
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <h2>{exercise.name}</h2>
            <p>{exercise.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
