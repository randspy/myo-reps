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
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';
import { useState } from 'react';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';

export const AddNewExerciseDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { dispatchAdd } = useExercise();

  const submit = (values: ExerciseFormValues) => {
    dispatchAdd(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-fit">Add New Exercise</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ExerciseForm onSubmit={submit} />
      </DialogContent>
    </Dialog>
  );
};
