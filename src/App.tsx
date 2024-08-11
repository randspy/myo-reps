import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/app/Header';

export const App = () => (
  <div className="h-dvh">
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <Button className="m-4"> Hello </Button>
      <Outlet />
    </ThemeProvider>
  </div>
);
