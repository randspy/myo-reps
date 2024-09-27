import { Button } from '@/components/ui/button';
import { useFieldArray, useForm } from 'react-hook-form';
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
  WorkoutFormValues,
  workoutSchema,
} from '@/app/core/workouts/workouts-types';
import { ExerciseComboBox } from '@/app/features/workouts/components/ExerciseComboBox';

import { NumberScrollWheelSelectorPopover } from '@/app/ui/NumberScrollWheelSelectorPopover';
import { Trash2Icon } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createExerciseForWorkout } from '@/app/core/workouts/domain/workout-domain';
import { defaultWorkoutFormValues } from '@/app/core/workouts/domain/workouts-config';
import {
  selectActiveExercises,
  selectAllExercises,
} from '@/app/core/exercises/store/exercises-selectors';

export const WorkoutForm: React.FC<{
  onSubmit: (values: WorkoutFormValues) => void;
  onCancel: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  values?: WorkoutFormValues;
}> = ({
  onSubmit,
  onCancel,
  onDirtyChange,
  values = defaultWorkoutFormValues,
}) => {
  const exercises = selectAllExercises();
  const activeExercises = selectActiveExercises();

  const [active, setActive] = useState(0);

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    values,
  });
  const { fields, append, move } = useFieldArray({
    name: 'exercises',
    control: form.control,
  });

  const {
    formState: { isDirty },
  } = form;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty]);

  const submit = (values: WorkoutFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)}>
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
        <Reorder.Group
          values={fields}
          onReorder={(exercises) => {
            exercises.forEach((exercise, index) => {
              const activeExercise = fields[active];
              if (exercise === activeExercise) {
                move(active, index);
                setActive(index);
              }
            });
          }}
        >
          {fields.map((exercise, index) => (
            <Reorder.Item
              key={exercise.id}
              value={exercise}
              id={exercise.id}
              onDragStart={() => setActive(index)}
            >
              <FormField
                control={form.control}
                key={index}
                name={`exercises.${index}.exerciseId`}
                render={() => (
                  <FormItem className="mb-2">
                    <FormControl>
                      <div className="grid w-full grid-cols-[1fr,minmax(7rem,auto)] space-x-2">
                        <ExerciseComboBox
                          items={exercises}
                          dropdownItems={activeExercises}
                          selected={form.getValues(`exercises.${index}`)}
                          onSelect={(item) => {
                            form.setValue(
                              `exercises.${index}.exerciseId`,
                              item.exerciseId,
                              {
                                shouldDirty: true, // by default for array fields it wasn't dirtying the form
                              },
                            );
                            form.clearErrors(`exercises.${index}.exerciseId`);
                          }}
                        />
                        <div className="flex justify-end">
                          <NumberScrollWheelSelectorPopover
                            value={form.getValues(`exercises.${index}.sets`)}
                            label="Sets"
                            max={20}
                            onValueChange={(value) => {
                              form.setValue(`exercises.${index}.sets`, value, {
                                shouldDirty: true, // by default for array fields it wasn't dirtying the form
                              });
                              form.clearErrors(`exercises.${index}.sets`);
                            }}
                          />
                          <Button
                            type="button"
                            className="ml-2"
                            aria-label="Delete exercise"
                            variant="icon"
                            size="icon"
                            onClick={() => {
                              form.setValue(
                                'exercises',
                                fields.filter((_, i) => i !== index),
                              );
                            }}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <Button
          className="mb-4 mt-2 w-full"
          type="button"
          onClick={() => append(createExerciseForWorkout())}
        >
          Add Exercise
        </Button>

        <div className="flex flex-col-reverse gap-2 md:flex-row">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
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
  );
};
