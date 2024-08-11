import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from './components/mode-toggle';

export const App = () => (
  <div className="h-dvh">
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Button> Hello </Button>
      <ModeToggle />
      <Outlet />
    </ThemeProvider>
  </div>
);
