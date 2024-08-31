import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExerciseForm } from '@/app/features/exercises/ExerciseForm';
import {
  ExerciseValue,
  ExerciseFormValues,
} from '@/app/core/exercises/exercises-schema';
import { useState } from 'react';
import { PencilIcon } from 'lucide-react';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';

export const EditExerciseDialog: React.FC<{ exercise: ExerciseValue }> = ({
  exercise,
}) => {
  const [open, setOpen] = useState(false);
  const { dispatchUpdate } = useExercise();

  const submit = (values: ExerciseFormValues) => {
    dispatchUpdate({
      ...exercise,
      ...values,
    });
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
        <ExerciseForm onSubmit={submit} onCancel={() => {}} values={exercise} />
      </DialogContent>
    </Dialog>
  );
};
