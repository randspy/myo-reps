import { useNavigate, useParams } from 'react-router-dom';
import { ExerciseForm } from '@/app/features/exercises/components/ExerciseForm';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-types';
import { FormCard } from '@/app/ui/FormCard';
import { selectExerciseById } from '@/app/core/exercises/store/exercises-selectors';
import {
  UnsavedFormChangesBlocker,
  OnDirtyChange,
  OnSubmit,
} from '@/app/ui/UnsavedFormChangesBlocker';
import { PageNotFound } from '@/app/ui/PageNotFound';

export const EditExercisePage: React.FC = () => {
  const { dispatchUpdateExercise } = useExercise();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const exercise = selectExerciseById(id);

  if (!exercise) {
    return <PageNotFound />;
  }

  return (
    <FormCard title="Edit Exercise">
      <UnsavedFormChangesBlocker>
        {(onDirtyChange: OnDirtyChange, onSubmit: OnSubmit) => (
          <ExerciseForm
            onSubmit={async (values: ExerciseFormValues) => {
              onSubmit();
              await dispatchUpdateExercise({
                ...exercise,
                ...values,
              });
              navigate('/exercises');
            }}
            onCancel={() => navigate('/exercises')}
            onDirtyChange={onDirtyChange}
            values={exercise}
          />
        )}
      </UnsavedFormChangesBlocker>
    </FormCard>
  );
};
