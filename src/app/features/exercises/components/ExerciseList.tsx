import React from 'react';
import { DeleteExerciseDialog } from '@/app/features/exercises/components/DeleteExerciseDialog';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { DragAndDropList } from '@/app/ui/DragAndDropList';
import { DragAndDropListItem } from '@/app/ui/DragAndDropListItem';
import { selectActiveExercises } from '@/app/core/exercises/store/exercises-selectors';

export const ExerciseList: React.FC = () => {
  const activeExercises = selectActiveExercises();
  const { dispatchSetExercises } = useExercise();

  return (
    <div className="w-full">
      <DragAndDropList
        values={activeExercises}
        onReorder={(values) => dispatchSetExercises(values)}
      >
        {activeExercises?.map((exercise) => (
          <DragAndDropListItem key={exercise.id} value={exercise}>
            <h3 className="mr-auto truncate">{exercise.name}</h3>
            <Button asChild variant="icon" size="icon">
              <Link to={`/exercises/${exercise.id}`} aria-label="Edit exercise">
                <PencilIcon className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteExerciseDialog exercise={exercise} />
          </DragAndDropListItem>
        ))}
      </DragAndDropList>
    </div>
  );
};
