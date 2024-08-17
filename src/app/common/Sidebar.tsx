import { cn } from '@/lib/utils';
import { RouteType } from '../routes';
import { Link } from 'react-router-dom';

export type SidebarProps = {
  tabs: RouteType;
  path: string;
  close: () => void;
};

export function Sidebar({ tabs, path, close }: SidebarProps) {
  const activeTab = tabs[path];

  return (
    <div
      className="h-dvh border-r border-r-border bg-background-secondary pt-1 shadow-sm"
      data-testid="sidebar"
    >
      <h1 className="my-8 flex justify-center text-2xl font-semibold">
        Myo Reps
      </h1>
      <ul>
        {Object.keys(tabs).map((key) => (
          <li key={key}>
            <Link
              to={key}
              className={cn(
                'focus-visible:shadow-outline m-2 mr-6 block rounded-sm outline-none hover:opacity-90',
                activeTab?.title !== tabs[key]?.title &&
                  'hover:hover:bg-accent',
              )}
              onClick={() => close()}
            >
              <div
                className={cn(
                  'rounded-sm px-4 py-3',
                  activeTab?.title === tabs[key]?.title &&
                    'bg-primary text-primary-foreground',
                )}
              >
                {tabs[key].title}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
