import { useNavigate } from 'react-router-dom';
import { ExerciseForm } from './ExerciseForm';
import { useExercise } from '@/app/core/exercises/hooks/useExercise';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';
import { FormCard } from '@/app/ui/FormCard';

export const NewExercisePage: React.FC = () => {
  const { dispatchAdd } = useExercise();
  const navigate = useNavigate();

  const submit = (values: ExerciseFormValues) => {
    dispatchAdd(values);
    navigate('/exercises');
  };

  return (
    <FormCard title="Add New Exercise">
      <ExerciseForm onSubmit={submit} onCancel={() => navigate('/exercises')} />
    </FormCard>
  );
};
