import { SessionsPage } from '@/app/features/sessions/components/SessionsPage';
import { StartSessionPage } from '@/app/features/sessions/components/StartSessionPage';
import { RunningSessionPage } from '@/app/features/sessions/components/RunningSessionPage';

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
        element: <RunningSessionPage />,
      },
    ],
  },
];
