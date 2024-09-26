import { EditWorkoutPage } from '@/app/features/workouts/components/EditWorkoutPage';
import { NewWorkoutPage } from '@/app/features/workouts/components/NewWorkoutPage';
import { WorkoutsPage } from '@/app/features/workouts/components/WorkoutsPage';

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
