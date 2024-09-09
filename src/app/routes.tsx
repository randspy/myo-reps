import { App } from '@/App';
import { Navigate } from 'react-router-dom';
import { PageNotFound } from '@/app/layout/PageNotFound';
import { ErrorPage } from '@/app/layout/ErrorPage';
import { exerciseRoutes } from '@/app/features/exercises/routes';
import { workoutRoutes } from '@/app/features/workouts/routes';
import { sessionRoutes } from '@/app/features/sessions/routes';

export type RouteType = { title: string; url: string };

export const sideBarRoutePaths: RouteType[] = [
  {
    title: 'Workouts',
    url: '/workouts',
  },
  {
    title: 'Exercises',
    url: '/exercises',
  },
  {
    title: 'Sessions',
    url: '/sessions',
  },
];

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
      ...exerciseRoutes,
      ...workoutRoutes,
      ...sessionRoutes,
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
];
