import React from 'react';
import { EditExerciseDialog } from '@/app/features/exercises/EditExerciseDialog';
import { DeleteExerciseDialog } from '@/app/features/exercises/DeleteExerciseDialog';
import { Reorder } from 'framer-motion';

import { useExercise } from '@/app/core/exercises/hooks/useExercise';

export const ExerciseList: React.FC = () => {
  const { activeExercises, dispatchSet } = useExercise();

  return (
    <div className="w-full">
      <Reorder.Group
        className="flex flex-col items-center"
        values={activeExercises}
        onReorder={(values) => dispatchSet(values)}
      >
        {activeExercises?.map((exercise) => (
          <Reorder.Item
            key={exercise.id}
            value={exercise}
            className="my-2 flex w-full items-center rounded-md bg-background-secondary p-5 pr-2 shadow-sm md:w-128"
          >
            <h3 className="mr-auto truncate">{exercise.name}</h3>
            <EditExerciseDialog exercise={exercise} />
            <DeleteExerciseDialog exercise={exercise} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
