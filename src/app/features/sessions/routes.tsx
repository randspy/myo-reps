import { SessionsPage } from '@/app/features/sessions/SessionsPage';

export const sessionRoutes = [
  {
    path: '/sessions',
    children: [
      {
        path: '',
        element: <SessionsPage />,
      },
    ],
  },
];
