import { Card } from '@/components/ui/card';

const TimeCard = ({ value, unit }: { value: number; unit: string }) => {
  return (
    <div className="h-24 w-20 sm:h-28 sm:w-24">
      <div className="relative h-full w-full">
        <Card className="backface-hidden absolute inset-0 flex items-center justify-center bg-card text-3xl font-bold text-foreground sm:text-4xl">
          <span>{value.toString().padStart(2, '0')}</span>
        </Card>
      </div>
      <p className="mt-1 text-center text-xs text-muted-foreground">{unit}</p>
    </div>
  );
};

export const Timer: React.FC<{
  time: number;
}> = ({ time = 0 }) => {
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  const hours = Math.floor(time / 3600);
  const showHours = minutes >= 60;

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className="flex space-x-2 sm:space-x-4"
        role="timer"
        aria-live="polite"
      >
        {showHours && <TimeCard value={hours} unit="Hours" />}
        <TimeCard value={minutes} unit="Minutes" />
        <TimeCard value={seconds} unit="Seconds" />
      </div>
    </div>
  );
};
