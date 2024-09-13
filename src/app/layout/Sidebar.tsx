import { cn } from '@/lib/utils';
import { RouteType } from '@/app/routes';
import { Link } from 'react-router-dom';
import { Logo } from '@/app/ui/Logo';

export type SidebarProps = {
  tabs: RouteType[];
  path: string;
  close: () => void;
};

export function Sidebar({ tabs, path, close }: SidebarProps) {
  const activeTab = tabs.find((tab) => path.includes(tab.url));

  return (
    <div
      className="h-dvh border-r border-r-border bg-background-secondary pt-1 shadow-md"
      data-testid="sidebar"
    >
      <div className="mb-10 mt-5">
        <Logo />
      </div>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.url}>
            <Link
              to={tab.url}
              className={cn(
                'my-2 block outline-none hover:opacity-90 focus-visible:shadow-outline md:-mr-4 md:ml-4',
                activeTab?.title !== tab.title && 'hover:hover:bg-accent',
              )}
              onClick={() => close()}
            >
              <div
                className={cn(
                  'px-4 py-3',
                  activeTab?.title === tab.title &&
                    'bg-primary text-primary-foreground',
                )}
              >
                {tab.title}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
