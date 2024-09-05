import { cn } from '@/lib/utils';
import { RouteType } from '@/app/routes';
import { Link } from 'react-router-dom';
import { Logo } from '@/app/ui/Logo';

export type SidebarProps = {
  tabs: RouteType;
  path: string;
  close: () => void;
};

export function Sidebar({ tabs, path, close }: SidebarProps) {
  const matchingTab = Object.keys(tabs).find((tab) => path.includes(tab));
  const activeTab = matchingTab ? tabs[matchingTab] : null;

  return (
    <div
      className="h-dvh border-r border-r-border bg-background-secondary pt-1 shadow-md"
      data-testid="sidebar"
    >
      <div className="mb-10 mt-5">
        <Logo />
      </div>
      <ul>
        {Object.keys(tabs).map((key) => (
          <li key={key}>
            <Link
              to={key}
              className={cn(
                'my-2 ml-4 block outline-none hover:opacity-90 focus-visible:shadow-outline md:-mr-4',
                activeTab?.title !== tabs[key]?.title &&
                  'hover:hover:bg-accent',
              )}
              onClick={() => close()}
            >
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
