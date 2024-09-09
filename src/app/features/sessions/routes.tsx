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
        element: (
          <div className="flex h-full items-center justify-center">
            <h2 className="text-2xl">TODO</h2>
          </div>
        ),
      },
    ],
  },
];
