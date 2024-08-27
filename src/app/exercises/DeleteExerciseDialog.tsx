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
import { ExerciseValue } from '@/features/exercises/exercises-schema';
import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { useExercise } from '@/features/exercises/hooks/useExercise';

export const DeleteExerciseDialog: React.FC<{ exercise: ExerciseValue }> = ({
  exercise,
}) => {
  const [open, setOpen] = useState(false);

  const { dispatchDelete } = useExercise();

  const deleteById = () => {
    dispatchDelete(exercise.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="icon" size="icon" aria-label="Delete exercise">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this exercise?
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
