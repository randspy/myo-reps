import { useNavigate, useParams } from 'react-router-dom';
import { ExerciseForm } from '@/app/features/exercises/ExerciseForm';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';
import { FormCard } from '@/app/ui/FormCard';
import { useSelector } from 'react-redux';
import { selectExerciseById } from '@/app/core/exercises/store/exercises-selectors';
import {
  UnsavedFormChangesBlocker,
  OnDirtyChange,
  OnSubmit,
} from '@/app/ui/UnsavedFormChangesBlocker';
import { PageNotFound } from '@/app/ui/PageNotFound';

export const EditExercisePage: React.FC = () => {
  const { dispatchUpdate } = useExercise();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const exercise = useSelector(selectExerciseById(id));

  if (!exercise) {
    return <PageNotFound />;
  }

  return (
    <FormCard title="Edit Exercise">
      <UnsavedFormChangesBlocker
        render={(onDirtyChange: OnDirtyChange, onSubmit: OnSubmit) => (
          <ExerciseForm
            onSubmit={(values: ExerciseFormValues) => {
              onSubmit();
              dispatchUpdate({
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
      />
    </FormCard>
  );
};
