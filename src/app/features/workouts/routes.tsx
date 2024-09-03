import { EditWorkoutPage } from '@/app/features/workouts/EditWorkoutPage';
import { NewWorkoutPage } from '@/app/features/workouts/NewWorkoutPage';
import { WorkoutsPage } from '@/app/features/workouts/WorkoutsPage';

export const workoutRoutes = [
  {
    path: '/workouts',
    children: [
      {
        path: '',
        element: <WorkoutsPage />,
      },
      {
        path: 'new',
        element: <NewWorkoutPage />,
      },
      {
        path: ':id',
        element: <EditWorkoutPage />,
      },
    ],
  },
];
