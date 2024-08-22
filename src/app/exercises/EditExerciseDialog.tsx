import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExerciseForm } from '@/app/exercises/ExerciseForm';
import {
  ExerciseValue,
  ExerciseFormValues,
} from '@/features/exercises/exercises-schema';
import { useState } from 'react';
import { updateExercise } from '@/features/exercises/exercises-slice';
import { useAppDispatch } from '@/store/hooks';
import { PencilIcon } from 'lucide-react';

export const EditExerciseDialog: React.FC<{ exercise: ExerciseValue }> = ({
  exercise,
}) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const submit = (values: ExerciseFormValues) => {
    dispatch(
      updateExercise({
        ...exercise,
        ...values,
      }),
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="icon" size="icon" aria-label="Edit exercise">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ExerciseForm onSubmit={submit} values={exercise} />
      </DialogContent>
    </Dialog>
  );
};
