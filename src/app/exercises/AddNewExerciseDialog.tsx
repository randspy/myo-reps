import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddNewExerciseForm } from '@/app/exercises/AddNewExerciseForm';
import { NewExerciseFormValues } from '@/features/exercises/exercises-schema';
import { useState } from 'react';

export function AddNewExerciseDialog({
  onSubmit,
}: {
  onSubmit: (values: NewExerciseFormValues) => void;
}) {
  const [open, setOpen] = useState(false);

  const submit = (values: NewExerciseFormValues) => {
    onSubmit(values);
    setOpen(false);
  };

  return (
    <div className="flex h-full items-center justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add New Exercise</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Exercise</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <AddNewExerciseForm onSubmit={submit} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
