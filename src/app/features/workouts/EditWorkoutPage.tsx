import { useNavigate, useParams } from 'react-router-dom';
import { FormCard } from '@/app/ui/FormCard';
import {
  OnDirtyChange,
  OnSubmit,
  UnsavedFormChangesBlocker,
} from '@/app/ui/UnsavedFormChangesBlocker';
import { useWorkout } from '@/app/core/workouts/hooks/useWorkout';
import { WorkoutFormValues } from '@/app/core/workouts/workouts-schema';
import { WorkoutForm } from '@/app/features/workouts/WorkoutForm';
import { selectWorkoutById } from '@/app/core/workouts/workouts-selectors';
import { useSelector } from 'react-redux';

export const EditWorkoutPage: React.FC = () => {
  const { dispatchUpdate } = useWorkout();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const workout = useSelector(selectWorkoutById(id));

  const submit = (values: WorkoutFormValues) => {
    if (!workout) {
      return;
    }

    dispatchUpdate({ ...workout, ...values });
    navigate('/workouts');
  };

  return (
    <FormCard title="Edit Workout">
      <UnsavedFormChangesBlocker
        render={(onDirtyChange: OnDirtyChange, onSubmit: OnSubmit) => (
          <WorkoutForm
            onSubmit={(values: WorkoutFormValues) => {
              onSubmit();
              submit(values);
            }}
            onCancel={() => navigate('/workouts')}
            onDirtyChange={onDirtyChange}
            values={workout}
          />
        )}
      />
    </FormCard>
  );
};
