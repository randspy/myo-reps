import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddNewExerciseForm } from './AddNewExerciseForm';
import { NewExerciseFormValues } from './schema';
import { useState } from 'react';

export function AddNewExerciseDialog() {
  const [open, setOpen] = useState(false);

  const onSubmit = (values: NewExerciseFormValues) => {
    console.log('submitted', values);
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
          <AddNewExerciseForm onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
