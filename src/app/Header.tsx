import { ModeToggle } from '@/components/mode-toggle';
import { Sidebar } from '@/app/Sidebar';
import { useLocation } from 'react-router-dom';
import { routePaths } from './routes';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { LegacyRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useClickAway } from '@uidotdev/usehooks';

export function Header() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ref = useClickAway(() => setIsSidebarOpen(false));

  return (
    <>
      <header
        className="flex h-20 items-center border-b border-b-border bg-background-secondary p-4 md:ml-48"
        data-testid="header"
      >
        <div className="mr-4 md:hidden">
          <Button
            variant="outline"
            size="icon"
            data-testid="sidebar-toggle"
            onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-lg" data-testid="title">
          {routePaths[location.pathname]?.title}
        </h2>
        <div className="ml-auto mr-4">
          <ModeToggle />
        </div>
      </header>
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        className={cn(
          'fixed left-0 top-0 w-48 -translate-x-full transform transition-transform duration-300 ease-in-out md:block md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '',
        )}
      >
        <Sidebar
          tabs={routePaths}
          path={location.pathname}
          close={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
}
