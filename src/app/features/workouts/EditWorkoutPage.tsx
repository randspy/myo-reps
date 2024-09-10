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
import { selectWorkoutById } from '@/app/core/workouts/store/workouts-selectors';
import { useSelector } from 'react-redux';
import { PageNotFound } from '@/app/ui/PageNotFound';

export const EditWorkoutPage: React.FC = () => {
  const { dispatchUpdate } = useWorkout();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const workout = useSelector(selectWorkoutById(id));

  if (!workout) {
    return <PageNotFound />;
  }

  return (
    <FormCard title="Edit Workout">
      <UnsavedFormChangesBlocker
        render={(onDirtyChange: OnDirtyChange, onSubmit: OnSubmit) => (
          <WorkoutForm
            onSubmit={(values: WorkoutFormValues) => {
              onSubmit();
              dispatchUpdate({ ...workout!, ...values });
              navigate('/workouts');
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
