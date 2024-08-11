import { cn } from '@/lib/utils';
import { RouteType } from './routes';
import { Link } from 'react-router-dom';

export function Sidebar({ tabs, path }: { tabs: RouteType; path: string }) {
  const activeTab = tabs[path];
  return (
    <div
      className="bg-background-secondary h-dvh border-r border-r-border pt-8"
      data-testid="sidebar"
    >
      <ul>
        {Object.keys(tabs).map((key) => (
          <li key={key}>
            <Link to={key} className="block w-full">
              <div
                className={cn(
                  'px-4 py-3',
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
