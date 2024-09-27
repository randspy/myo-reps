import { Button } from '@/components/ui/button';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { DeleteConfirmationDialog } from '@/app/ui/DeleteConfirmationDialog';

export const DeleteExerciseDialog: React.FC<{ exercise: ExerciseValue }> = ({
  exercise,
}) => {
  const [open, setOpen] = useState(false);
  const { dispatchDeleteExercise } = useExercise();

  const deleteById = () => {
    dispatchDeleteExercise(exercise.id);
    setOpen(false);
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={setOpen}
      title="Are you sure you want to delete this exercise?"
      description="This action cannot be undone."
      onDelete={deleteById}
    >
      <Button variant="icon" size="icon" aria-label="Delete exercise">
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </DeleteConfirmationDialog>
  );
};
