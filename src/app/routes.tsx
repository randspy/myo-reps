import { App } from '@/App';
import { Navigate } from 'react-router-dom';
import { WorkoutsPage } from '@/app/features/workouts/WorkoutsPage';
import { ExercisesPage } from '@/app/features/exercises/ExercisesPage';
import { SessionsPage } from '@/app/features/sessions/SessionsPage';
import { PageNotFound } from '@/app/layout/PageNotFound';
import { ErrorPage } from '@/app/layout/ErrorPage';

export type RouteType = Record<string, { title: string; element: JSX.Element }>;

export const routePaths: RouteType = {
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
    children: [
      {
        path: '/',
        element: <Navigate to="/workouts" />,
      },
      ...Object.keys(routePaths).map((key) => ({
        path: key,
        element: routePaths[key].element,
        errorElement: <ErrorPage />,
      })),
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
];
