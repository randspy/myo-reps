import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React from 'react';
import { EditWorkoutDialog } from '@/app/features/workouts/EditWorkoutDialog';
import { DeleteWorkoutDialog } from './DeleteWorkoutDialog';
import { Reorder } from 'framer-motion';
import { setWorkouts } from '@/app/core/workouts/workouts-slice';

export const WorkoutList: React.FC = () => {
  const workouts = useAppSelector((state) => state.workouts.values);
  const dispatch = useAppDispatch();

  return (
    <div className="w-full">
      <Reorder.Group
        className="flex flex-col items-center"
        values={workouts}
        onReorder={(values) => dispatch(setWorkouts(values))}
      >
        {workouts?.map((workout) => (
          <Reorder.Item
            key={workout.id}
            value={workout}
            className="my-2 flex w-full items-center rounded-md bg-background-secondary p-5 pr-2 shadow-sm md:w-128"
          >
            <h3 className="mr-auto truncate">{workout.name}</h3>
            <EditWorkoutDialog workout={workout} />
            <DeleteWorkoutDialog workout={workout} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
