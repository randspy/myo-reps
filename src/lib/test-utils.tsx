import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { v4 as uuidv4 } from 'uuid';
import { ReactElement } from 'react';
import { render } from '@testing-library/react';

import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { SessionValue } from '@/app/features/sessions/session-schema';

interface RenderWithRouterOptions {
  element: ReactElement;
  path: string;
}

export function renderWithRouter(
  children: ReactElement | RenderWithRouterOptions,
  routes: RouteObject[] = [],
) {
  const options = { element: children, path: '/' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const router = createMemoryRouter([{ ...options } as any, ...routes], {
    initialEntries: [options.path],
    initialIndex: 1,
  });

  return render(<RouterProvider router={router} />);
}

export const generateExercise = (
  values: Partial<ExerciseValue> = {},
): ExerciseValue => {
  return {
    id: uuidv4(),
    name: 'Exercise',
    description: 'Description',
    position: 0,
    usage: [],
    hidden: false,
    ...values,
  };
};

export const generateWorkout = (
  values: Partial<WorkoutValue> = {},
): WorkoutValue => {
  return {
    id: uuidv4(),
    name: 'Workout',
    description: 'Description',
    position: 0,
    exercises: [],
    usage: [],
    hidden: false,
    ...values,
  };
};

export const generateSession = (
  values: Partial<SessionValue> = {},
): SessionValue => {
  return {
    id: uuidv4(),
    workoutId: uuidv4(),
    startDate: new Date(),
    events: [],
    ...values,
  };
};
