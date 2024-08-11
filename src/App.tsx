import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/app/Header';
import { Sidebar } from './app/Sidebar';
import { routePaths } from './app/routes';

export const App = () => {
  const location = useLocation();

  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="fixed left-0 top-0 w-dvw">
          <Header title={routePaths[location.pathname]?.title} />
          <div className="w-48 -translate-x-full transform transition-transform duration-300 ease-in-out md:block md:translate-x-0">
            <Sidebar tabs={routePaths} path={location.pathname} />
          </div>
        </div>
        <div className="ml-0 mt-20 h-[calc(100dvh_-_20rem)] md:ml-48">
          <Outlet />
        </div>
      </ThemeProvider>
    </div>
  );
};
