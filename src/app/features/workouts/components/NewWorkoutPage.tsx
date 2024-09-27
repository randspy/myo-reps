import { useNavigate } from 'react-router-dom';
import { FormCard } from '@/app/ui/FormCard';
import {
  OnDirtyChange,
  OnSubmit,
  UnsavedFormChangesBlocker,
} from '@/app/ui/UnsavedFormChangesBlocker';
import { useWorkout } from '@/app/core/workouts/hooks/useWorkout';
import { WorkoutFormValues } from '@/app/core/workouts/workouts-types';
import { WorkoutForm } from '@/app/features/workouts/components/WorkoutForm';

export const NewWorkoutPage: React.FC = () => {
  const { dispatchAddWorkout } = useWorkout();
  const navigate = useNavigate();

  return (
    <FormCard title="Add New Workout">
      <UnsavedFormChangesBlocker>
        {(onDirtyChange: OnDirtyChange, onSubmit: OnSubmit) => (
          <WorkoutForm
            onSubmit={(values: WorkoutFormValues) => {
              onSubmit();
              dispatchAddWorkout(values);
              navigate('/workouts');
            }}
            onCancel={() => navigate('/workouts')}
            onDirtyChange={onDirtyChange}
          />
        )}
      </UnsavedFormChangesBlocker>
    </FormCard>
  );
};
