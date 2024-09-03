import { App } from '@/App';
import { Navigate } from 'react-router-dom';
import { WorkoutsPage } from '@/app/features/workouts/WorkoutsPage';
import { ExercisesPage } from '@/app/features/exercises/ExercisesPage';
import { SessionsPage } from '@/app/features/sessions/SessionsPage';
import { PageNotFound } from '@/app/layout/PageNotFound';
import { ErrorPage } from '@/app/layout/ErrorPage';
import { NewExercisePage } from './features/exercises/NewExercisePage';
import { EditExercisePage } from './features/exercises/EditExercisePage';
import { NewWorkoutPage } from './features/workouts/NewWorkoutPage';
import { EditWorkoutPage } from './features/workouts/EditWorkoutPage';

export type RouteType = Record<string, { title: string; element: JSX.Element }>;

export const sideBarRoutePaths: RouteType = {
  '/workouts': {
    title: 'Workouts',
    element: <WorkoutsPage />,
  },
  '/exercises': {
    title: 'Exercises',
    element: <ExercisesPage />,
  },
  '/sessions': {
    title: 'Sessions',
    element: <SessionsPage />,
  },
};

export const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Navigate to="/workouts" />,
      },
      ...Object.keys(sideBarRoutePaths).map((key) => ({
        path: key,
        element: sideBarRoutePaths[key].element,
      })),
      {
        path: '/exercises/new',
        element: <NewExercisePage />,
      },
      {
        path: '/exercises/:id',
        element: <EditExercisePage />,
      },
      {
        path: '/workouts/new',
        element: <NewWorkoutPage />,
      },
      {
        path: '/workouts/:id',
        element: <EditWorkoutPage />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
];
