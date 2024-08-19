import { Button } from '@/components/ui/button';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAppSelector } from '@/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  defaultValues,
  WorkoutFormValues,
  workoutSchema,
} from '@/features/workouts/workouts-schema';
import { ExerciseComboBox } from '@/app/workouts/ExerciseComboBox';
import { v4 as uuidv4 } from 'uuid';

export const WorkoutForm: React.FC<{
  onSubmit: (values: WorkoutFormValues) => void;
}> = ({ onSubmit }) => {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues,
  });

  const { fields, append } = useFieldArray({
    name: 'exercises',
    control: form.control,
  });

  const exercises = useAppSelector((state) => state.exercises.values);

  const submit = (values: WorkoutFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        data-testid="add-new-exercise-form"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Workout Name</FormLabel>
              <FormControl>
                <Input placeholder="Upper body workout" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Workout description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.length > 0 && (
          <FormLabel className="mb-2 inline-block">Exercises</FormLabel>
        )}
        {fields.map((exercise, index) => (
          <div key={exercise.id}>
            <FormField
              control={form.control}
              key={index}
              name={`exercises.${index}.exerciseId`}
              render={() => (
                <FormItem className="mb-2">
                  <FormControl>
                    <div className="w-full">
                      <ExerciseComboBox
                        items={exercises}
                        selected={form.getValues(`exercises.${index}`)}
                        onSelect={(item) => {
                          form.setValue(
                            `exercises.${index}.exerciseId`,
                            item.exerciseId,
                          );
                          form.clearErrors(`exercises.${index}.exerciseId`);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          className="mb-4 mt-2 w-full"
          type="button"
          onClick={() =>
            append({ id: uuidv4(), repetitions: 1, exerciseId: '' })
          }
        >
          Add Exercise
        </Button>

        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
};
