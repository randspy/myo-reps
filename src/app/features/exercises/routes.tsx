import { EditExercisePage } from '@/app/features/exercises/components/EditExercisePage';
import { ExercisesPage } from '@/app/features/exercises/components/ExercisesPage';
import { NewExercisePage } from '@/app/features/exercises/components/NewExercisePage';

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
