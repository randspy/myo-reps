import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { WorkoutForm } from '@/app/workouts/WorkoutForm';
import { WorkoutFormValues } from '@/features/workouts/workouts-schema';
import { useAppDispatch } from '@/store/hooks';
import { addWorkout } from '@/features/workouts/workouts-slice';

export const AddNewWorkoutDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const submit = (values: WorkoutFormValues) => {
    dispatch(addWorkout(values));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-fit">Add New Workout</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Workout</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <WorkoutForm onSubmit={submit} />
      </DialogContent>
    </Dialog>
  );
};
