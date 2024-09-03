import { EditExercisePage } from '@/app/features/exercises/EditExercisePage';
import { ExercisesPage } from '@/app/features/exercises/ExercisesPage';
import { NewExercisePage } from '@/app/features/exercises/NewExercisePage';

export const exerciseRoutes = [
  {
    path: '/exercises',
    children: [
      {
        path: '',
        element: <ExercisesPage />,
      },
      {
        path: 'new',
        element: <NewExercisePage />,
      },
      {
        path: ':id',
        element: <EditExercisePage />,
      },
    ],
  },
];
