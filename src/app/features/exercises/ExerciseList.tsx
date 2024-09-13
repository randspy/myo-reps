import React from 'react';
import { DeleteExerciseDialog } from '@/app/features/exercises/DeleteExerciseDialog';
import { Reorder } from 'framer-motion';

import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';

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
            className="my-1 flex w-full cursor-grab items-center bg-background-secondary p-5 pr-2 shadow-sm focus-within:shadow-md hover:shadow-md md:w-128"
          >
            <h3 className="mr-auto truncate">{exercise.name}</h3>
            <Button asChild variant="icon" size="icon">
              <Link to={`/exercises/${exercise.id}`} aria-label="Edit exercise">
                <PencilIcon className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteExerciseDialog exercise={exercise} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
