import { useLocation } from 'react-router-dom';
import { routeNames } from './routes';
import { ModeToggle } from '@/components/mode-toggle';

export function Header() {
  const location = useLocation();

  return (
    <header className="bg-background-secondary flex items-center p-4">
      <h1 className="mr-8 text-2xl font-semibold">Myo Reps</h1>
      <h2 className="text-lg">{routeNames[location.pathname]}</h2>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  );
}
