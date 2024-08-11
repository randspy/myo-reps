import { App } from '@/App';
import { Navigate } from 'react-router-dom';
import Workouts from './workouts/Workouts';

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/workouts" />,
      },
      {
        path: '/workouts',
        element: <Workouts />,
      },
    ],
  },
];

export const routeNames: Record<string, string> = {
  '/workouts': 'Workouts',
};
