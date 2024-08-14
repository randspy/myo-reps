import { App } from '@/App';
import { Navigate } from 'react-router-dom';
import { Workouts } from './workouts/Workouts';
import { ExercisePage } from './exercises/ExercisePage';
import Sessions from './sessions/Sessions';

export type RouteType = Record<string, { title: string; element: JSX.Element }>;

export const routePaths: RouteType = {
  '/workouts': {
    title: 'Workouts',
    element: <Workouts />,
  },
  '/exercises': {
    title: 'Exercises',
    element: <ExercisePage />,
  },
  '/sessions': {
    title: 'Sessions',
    element: <Sessions />,
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
      })),
    ],
  },
];
