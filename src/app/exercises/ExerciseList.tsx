import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { EditExerciseDialog } from './EditExerciseDialog';
import { DeleteExerciseDialog } from './DeleteExerciseDialog';

export const ExerciseList: React.FC = () => {
  const exercises = useAppSelector((state) => state.exercises.values);

  return (
    <div className="w-full">
      <ul className="flex flex-col items-center">
        {exercises?.map((exercise) => (
          <li
            key={exercise.id}
            className="md:w-128 my-2 flex w-full items-center rounded-md bg-background-secondary p-5 pr-2 shadow-sm"
          >
            <h3 className="mr-auto truncate">{exercise.name}</h3>
            <EditExerciseDialog exercise={exercise} />
            <DeleteExerciseDialog exercise={exercise} />
          </li>
        ))}
      </ul>
    </div>
  );
};
