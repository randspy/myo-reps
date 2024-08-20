import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { EditWorkoutDialog } from '@/app/workouts/EditWorkoutDialog';
import { DeleteWorkoutDialog } from './DeleteWorkoutDialog';

export const WorkoutList: React.FC = () => {
  const workouts = useAppSelector((state) => state.workouts.values);

  return (
    <div className="w-full">
      <ul className="flex flex-col items-center">
        {workouts?.map((workout) => (
          <li
            key={workout.id}
            className="my-2 flex w-full items-center rounded-md bg-background-secondary p-5 pr-2 shadow-sm md:w-128"
          >
            <h3 className="mr-auto truncate">{workout.name}</h3>
            <EditWorkoutDialog workout={workout} />
            <DeleteWorkoutDialog workout={workout} />
          </li>
        ))}
      </ul>
    </div>
  );
};
