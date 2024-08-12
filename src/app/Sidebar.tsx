import { cn } from '@/lib/utils';
import { RouteType } from './routes';
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
      className="h-dvh border-r border-r-border bg-background-secondary pt-1"
      data-testid="sidebar"
    >
      <h1 className="my-8 flex justify-center text-2xl font-semibold">
        Myo Reps
      </h1>
      <ul>
        {Object.keys(tabs).map((key) => (
          <li key={key}>
            <Link to={key} className="block w-full" onClick={() => close()}>
              <div
                className={cn(
                  'mr-4 rounded-sm px-4 py-3',
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
