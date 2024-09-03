import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { v4 as uuidv4 } from 'uuid';
import React, { PropsWithChildren, ReactElement } from 'react';
import { render, renderHook, RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';

import { Provider } from 'react-redux';
import { rootReducer, RootState } from '@/store/store';
import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof setupStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export function renderHookWithProviders<T>(
  hookFunction: () => T,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return {
    store,
    ...renderHook(hookFunction, { wrapper: Wrapper, ...renderOptions }),
  };
}

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
    ...values,
  };
};
