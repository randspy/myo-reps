import { ExerciseValue } from '@/features/exercises/exercises-schema';
import React from 'react';

export const ExerciseList: React.FC<{ exercises: ExerciseValue[] }> = ({
  exercises,
}) => {
  return (
    <div className="w-full">
      <ul className="flex flex-col items-center">
        {exercises.map((exercise) => (
          <li
            key={exercise.id}
            className="md:w-128 my-2 w-full rounded-sm bg-background-secondary p-8 shadow-sm"
          >
            <h3>{exercise.name}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};
