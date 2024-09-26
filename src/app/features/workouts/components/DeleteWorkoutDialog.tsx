import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { useWorkout } from '@/app/core/workouts/hooks/useWorkout';
import { DeleteConfirmationDialog } from '@/app/ui/DeleteConfirmationDialog';

export const DeleteWorkoutDialog: React.FC<{ workout: WorkoutValue }> = ({
  workout,
}) => {
  const [open, setOpen] = useState(false);
  const { dispatchDelete } = useWorkout();

  const deleteById = () => {
    dispatchDelete(workout.id);
    setOpen(false);
  };

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={setOpen}
      title="Are you sure you want to delete this workout?"
      description="This action cannot be undone."
      onDelete={deleteById}
    >
      <Button variant="icon" size="icon" aria-label="Delete workout">
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </DeleteConfirmationDialog>
  );
};
