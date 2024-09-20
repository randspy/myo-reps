const Radius = 45;
const circumference = 2 * Math.PI * Radius;

export const CircularTimer: React.FC<{
  time: number;
  startTimeForAnimation?: number;
  showProgressRing?: boolean;
}> = ({ time = 0, startTimeForAnimation = 0, showProgressRing = false }) => {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : seconds}`;
  };

  const calculateStrokeDashoffset = (time: number) => {
    if (!startTimeForAnimation) {
      return 0;
    }
    const progress =
      ((startTimeForAnimation - time) / startTimeForAnimation) * 100;
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

          {showProgressRing && (
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
