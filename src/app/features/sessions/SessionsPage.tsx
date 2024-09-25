import { SessionList } from '@/app/features/sessions/SessionList';

export const SessionsPage: React.FC = () => {
  return (
    <div className="my-8 flex h-full flex-col items-center px-2">
      <SessionList />
    </div>
  );
};
