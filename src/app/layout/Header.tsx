import { ModeToggle } from '@/components/ui/mode-toggle';
import { Sidebar } from '@/app/layout/Sidebar';
import { useLocation } from 'react-router-dom';
import { sideBarRoutePaths } from '../routes';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { LegacyRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useClickAway } from '@uidotdev/usehooks';
import { ClearAppState } from '@/app/pattern/ClearAppState';

export function Header() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ref = useClickAway(() => setIsSidebarOpen(false));

  const activeSidebarElementPath = sideBarRoutePaths.find((tab) => {
    return location.pathname.includes(tab.url);
  })?.title;

  return (
    <>
      <header
        className="flex h-20 items-center border-b border-b-border bg-background-secondary p-4 md:ml-48"
        data-testid="header"
      >
        <div className="mr-4 md:hidden">
          <Button
            variant="icon"
            size="icon"
            data-testid="sidebar-toggle"
            onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="truncate text-lg md:ml-4" data-testid="title">
          {activeSidebarElementPath}
        </h2>

        <div className="ml-auto mr-2">
          <ModeToggle />
        </div>
        <ClearAppState />
      </header>
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        className={cn(
          'fixed left-0 top-0 w-48 -translate-x-full transform transition-transform duration-300 ease-in-out md:block md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '',
        )}
      >
        <Sidebar
          tabs={sideBarRoutePaths}
          path={location.pathname}
          close={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
}
