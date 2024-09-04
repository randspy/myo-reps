import { SessionsPage } from '@/app/features/sessions/SessionsPage';
import { StartSessionPage } from '@/app/features/sessions/StartSessionPage';

export const sessionRoutes = [
  {
    path: '/sessions',
    children: [
      {
        path: '',
        element: <SessionsPage />,
      },
      {
        path: 'new',
        element: <StartSessionPage />,
      },
      {
        path: 'in-progress',
        element: <div>In progress</div>,
      },
    ],
  },
];
