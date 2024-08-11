import { ModeToggle } from '@/components/mode-toggle';

export function Header({ title }: { title: string }) {
  return (
    <>
      <header
        className="bg-background-secondary flex h-20 items-center border-b border-b-border p-4"
        data-testid="header"
      >
        <h1 className="ml-6 mr-16 hidden text-2xl font-semibold md:block">
          Myo Reps
        </h1>
        <h2 className="text-lg">{title}</h2>
        <div className="ml-auto mr-4">
          <ModeToggle />
        </div>
      </header>
    </>
  );
}
