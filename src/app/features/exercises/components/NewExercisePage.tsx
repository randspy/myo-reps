import { useNavigate } from 'react-router-dom';
import { ExerciseForm } from '@/app/features/exercises/components/ExerciseForm';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-types';
import { FormCard } from '@/app/ui/FormCard';
import {
  OnDirtyChange,
  OnSubmit,
  UnsavedFormChangesBlocker,
} from '@/app/ui/UnsavedFormChangesBlocker';

export const NewExercisePage: React.FC = () => {
  const { dispatchAddExercise } = useExercise();
  const navigate = useNavigate();

  return (
    <FormCard title="Add New Exercise">
      <UnsavedFormChangesBlocker>
        {(onDirtyChange: OnDirtyChange, onSubmit: OnSubmit) => (
          <ExerciseForm
            onSubmit={(values: ExerciseFormValues) => {
              onSubmit();
              dispatchAddExercise(values);
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
