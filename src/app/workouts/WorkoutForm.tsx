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
import { NumberScrollWheelSelectorPopover } from '@/app/common/NumberScrollWheelSelectorPopover';
import { Trash2Icon } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectVisibleExercises } from '@/features/exercises/exercises-selectors';

export const WorkoutForm: React.FC<{
  onSubmit: (values: WorkoutFormValues) => void;
  values?: WorkoutFormValues;
}> = ({ onSubmit, values = defaultValues }) => {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    values,
  });

  const { fields, append, move } = useFieldArray({
    name: 'exercises',
    control: form.control,
  });
  const [active, setActive] = useState(0);

  const exercises = useAppSelector((state) => state.exercises.values);
  const availableExercises = useSelector(selectVisibleExercises);

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
                          dropdownItems={availableExercises}
                          selected={form.getValues(`exercises.${index}`)}
                          onSelect={(item) => {
                            form.setValue(
                              `exercises.${index}.exerciseId`,
                              item.exerciseId,
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
                              form.setValue(`exercises.${index}.sets`, value);
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
          onClick={() => append({ id: uuidv4(), sets: 1, exerciseId: '' })}
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
