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
import { ModifiedFormDialog } from '@/app/ui/ModifiedFormDialog';
import { useState } from 'react';

export const ExerciseForm: React.FC<{
  onSubmit: (values: ExerciseFormValues) => void;
  onCancel: () => void;
  values?: ExerciseFormValues;
}> = ({ onSubmit, onCancel, values = defaultValues }) => {
  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    values,
  });

  const isDirty = form.formState.isDirty;

  const [dialogOpen, setDialogOpen] = useState(false);

  function cancel() {
    if (isDirty) {
      setDialogOpen(true);
    } else {
      onCancel();
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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

          <div className="flex flex-col-reverse justify-between gap-4 md:flex-row">
            <Button type="button" variant="outline" onClick={cancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
      <ModifiedFormDialog
        open={dialogOpen}
        cancel={() => setDialogOpen(false)}
        ok={() => {
          setDialogOpen(false);
          onCancel();
        }}
      />
    </>
  );
};
