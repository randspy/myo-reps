import { useNavigate, useParams } from 'react-router-dom';
import { ExerciseForm } from './ExerciseForm';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';
import { FormCard } from '@/app/ui/FormCard';
import { useSelector } from 'react-redux';
import { selectExerciseById } from '@/app/core/exercises/exercises-selectors';
import {
  UnsavedFormChangesBlocker,
  OnDirtyChange,
  OnSubmit,
} from '@/app/ui/UnsavedFormChangesBlocker';

export const EditExercisePage: React.FC = () => {
  const { dispatchUpdate } = useExercise();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const exercise = useSelector(selectExerciseById(id));

  const submit = (values: ExerciseFormValues) => {
    if (!exercise) {
      return;
    }

    dispatchUpdate({
      ...exercise,
      ...values,
    });
    navigate('/exercises');
  };

  return (
    <FormCard title="Edit Exercise">
      <UnsavedFormChangesBlocker
        render={(onDirtyChange: OnDirtyChange, onSubmit: OnSubmit) => (
          <ExerciseForm
            onSubmit={(values: ExerciseFormValues) => {
              onSubmit();
              submit(values);
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
