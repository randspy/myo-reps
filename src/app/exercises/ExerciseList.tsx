import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React from 'react';
import { EditExerciseDialog } from '@/app/exercises/EditExerciseDialog';
import { DeleteExerciseDialog } from '@/app/exercises/DeleteExerciseDialog';
import { Reorder } from 'framer-motion';
import { setExercises } from '@/features/exercises/exercises-slice';

export const ExerciseList: React.FC = () => {
  const exercises = useAppSelector((state) => state.exercises.values);
  const dispatch = useAppDispatch();

  return (
    <div className="w-full">
      <Reorder.Group
        className="flex flex-col items-center"
        values={exercises}
        onReorder={(values) => dispatch(setExercises(values))}
      >
        {exercises?.map((exercise) => (
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
