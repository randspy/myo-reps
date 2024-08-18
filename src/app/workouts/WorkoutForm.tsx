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
        className="space-y-6"
        data-testid="add-new-exercise-form"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Workout description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="button"
          onClick={() =>
            append({ name: '', id: crypto.randomUUID(), repetitions: 1 })
          }
        >
          Add Exercise
        </Button>

        {fields.map((exercise, index) => (
          <div key={exercise.id}>
            <FormField
              control={form.control}
              key={index}
              name={`exercises.${index}.name`}
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="w-full">
                      <ExerciseComboBox
                        items={exercises}
                        selected={form.getValues(`exercises.${index}`)}
                        onSelect={(item) => {
                          form.setValue(`exercises.${index}.name`, item.name);
                          form.clearErrors(`exercises.${index}.name`);
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

        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
};
