import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExerciseFormValues } from '@/features/exercises/exercises-schema';
import { useState } from 'react';
import { PencilIcon } from 'lucide-react';
import { WorkoutValue } from '@/features/workouts/workouts-schema';
import { WorkoutForm } from './WorkoutForm';
import { useWorkout } from './hooks/useWorkout';

export const EditWorkoutDialog: React.FC<{ workout: WorkoutValue }> = ({
  workout,
}) => {
  const [open, setOpen] = useState(false);
  const { dispatchUpdate } = useWorkout();

  const submit = (values: ExerciseFormValues) => {
    dispatchUpdate({ ...workout, ...values });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="icon" size="icon" aria-label="Edit workout">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workout</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <WorkoutForm onSubmit={submit} values={workout} />
      </DialogContent>
    </Dialog>
  );
};
