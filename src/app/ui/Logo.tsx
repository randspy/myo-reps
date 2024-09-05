import { Award, Dumbbell, LandPlot, Medal, Trophy } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div>
      <div className="flex justify-center">
        <Dumbbell className="h-4 w-4" />
        <Medal className="h-4 w-4" />
        <Trophy className="h-4 w-4" />
        <Award className="h-4 w-4" />
        <LandPlot className="h-4 w-4" />
      </div>
      <h1 className="text-1xl flex justify-center font-semibold">Myo Reps</h1>
    </div>
  );
};
