import { useNavigate } from 'react-router-dom';
import { ExerciseForm } from '@/app/features/exercises/ExerciseForm';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';
import { FormCard } from '@/app/ui/FormCard';
import {
  OnDirtyChange,
  OnSubmit,
  UnsavedFormChangesBlocker,
} from '@/app/ui/UnsavedFormChangesBlocker';

export const NewExercisePage: React.FC = () => {
  const { dispatchAdd } = useExercise();
  const navigate = useNavigate();

  return (
    <FormCard title="Add New Exercise">
      <UnsavedFormChangesBlocker>
        {(onDirtyChange: OnDirtyChange, onSubmit: OnSubmit) => (
          <ExerciseForm
            onSubmit={(values: ExerciseFormValues) => {
              onSubmit();
              dispatchAdd(values);
              navigate('/exercises');
            }}
            onCancel={() => navigate('/exercises')}
            onDirtyChange={onDirtyChange}
          />
        )}
      </UnsavedFormChangesBlocker>
    </FormCard>
  );
};
