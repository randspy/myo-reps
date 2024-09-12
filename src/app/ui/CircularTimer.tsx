import { useState, useEffect } from 'react';

const Radius = 45;
const circumference = 2 * Math.PI * Radius;

export const CircularTimer: React.FC<{
  initialTime?: number;
  isActive?: boolean;
  isCountingUp?: boolean;
  onTick?: (time: number) => void;
}> = ({ initialTime = 60, isActive = false, isCountingUp = false, onTick }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    onTick?.(time);
  }, [time, onTick]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (isCountingUp) {
            return prevTime + 1;
          } else {
            return prevTime === 0 ? 0 : prevTime - 1;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isCountingUp]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : seconds}`;
  };

  const calculateStrokeDashoffset = (time: number) => {
    const progress = ((initialTime - time) / initialTime) * 100;
    return circumference - (progress / 100) * circumference;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />

          {!isCountingUp && (
            <circle
              className="text-primary"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={calculateStrokeDashoffset(time)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              transform={'rotate(-90 50 50)'}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};
