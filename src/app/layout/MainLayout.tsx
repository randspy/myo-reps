import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Header } from '@/app/layout/Header';

export const MainLayout: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="fixed left-0 top-0 w-dvw">
        <Header />
      </div>
      <div className="ml-0 mt-20 h-[calc(100dvh_-_20rem)] py-1 md:ml-48">
        <Outlet />
      </div>
    </ThemeProvider>
  );
};
