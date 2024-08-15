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
import { addExercise } from '@/features/exercises/exercises-slice';
import { useAppDispatch } from '@/store/hooks';

export const AddNewExerciseDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const submit = (values: NewExerciseFormValues) => {
    dispatch(addExercise(values));
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
        <AddNewExerciseForm onSubmit={submit} />
      </DialogContent>
    </Dialog>
  );
};
