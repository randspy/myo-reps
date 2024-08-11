import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const App = () => (
  <div className="h-dvh">
    <Button> Hello </Button>
    <Outlet />
  </div>
);
