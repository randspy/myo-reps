import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { Trash2Icon } from 'lucide-react';
import { WorkoutValue } from '@/features/workouts/workouts-schema';
import { deleteWorkout } from '@/features/workouts/workouts-slice';

export const DeleteWorkoutDialog: React.FC<{ workout: WorkoutValue }> = ({
  workout,
}) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const deleteById = () => {
    dispatch(deleteWorkout(workout.id));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="workout-delete-button" variant="icon" size="icon">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this workout?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="icon" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={deleteById}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
