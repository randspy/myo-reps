import { Button } from '@/components/ui/button';
import { deleteExercise } from '@/features/exercises/exercises-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Trash2Icon } from 'lucide-react';
import React from 'react';
import { EditExerciseDialog } from './EditExerciseDialog';

export const ExerciseList: React.FC = () => {
  const dispatch = useAppDispatch();
  const exercises = useAppSelector((state) => state.exercises.values);

  const deleteExerciseById = (id: string) => {
    dispatch(deleteExercise(id));
  };

  return (
    <div className="w-full">
      <ul className="flex flex-col items-center">
        {exercises?.map((exercise) => (
          <li
            key={exercise.id}
            className="md:w-128 my-2 flex w-full items-center rounded-md bg-background-secondary p-5 shadow-sm"
          >
            <h3 className="truncate">{exercise.name}</h3>
            <div className="ml-auto">
              <EditExerciseDialog exercise={exercise} />
            </div>
            <Button
              className="ml-2"
              onClick={() => deleteExerciseById(exercise.id)}
              data-testid="delete-exercise"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
