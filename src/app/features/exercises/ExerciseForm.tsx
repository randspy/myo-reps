import { useForm } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  defaultValues,
  exerciseSchema,
  ExerciseFormValues,
} from '@/app/core/exercises/exercises-schema';
import { usePersistForm } from '@/app/core/hooks/usePersistentForm';

export const ExerciseForm: React.FC<{
  onSubmit: (values: ExerciseFormValues) => void;
  onCancel: () => void;
  values?: ExerciseFormValues;
}> = ({ onSubmit, onCancel, values = defaultValues }) => {
  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    values,
  });

  const { clear } = usePersistForm<ExerciseFormValues>('exercises', {
    watch: form.watch,
    setValue: form.setValue,
  });

  const submit = (values: ExerciseFormValues) => {
    onSubmit(values);
    clear();
  };

  return (
    <>
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
                <FormLabel>Exercise Name</FormLabel>
                <FormControl>
                  <Input placeholder="Push up" {...field} />
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
                  <Textarea placeholder="Exercise description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse gap-4 md:flex-row">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                clear();
              }}
            >
              Reset
            </Button>
            <Button className="md:ml-auto" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
