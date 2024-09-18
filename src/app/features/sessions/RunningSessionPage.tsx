import {
  DefaultRepetitions,
  MaxRepetitions,
} from '@/app/core/exercises/domain/exercises.config';
import { CircularTimer } from '@/app/ui/CircularTimer';
import { FormCard } from '@/app/ui/FormCard';
import { NumberScrollWheelSelectorPopover } from '@/app/ui/NumberScrollWheelSelectorPopover';
import { PageNotFound } from '@/app/ui/PageNotFound';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useRunningSession } from './hooks/useRunningSession';

export const RunningSessionPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workoutId = searchParams.get('workoutId');

  const {
    workout,
    time,
    startTime,

    isDisplayingNextExercise,
    isCountingUp,
    isSettingRepetitions,
    isWorkoutFinished,
    isReady,
    isRepFinished,
    readyForNextRepetition,
    setIsFinished,
    repetitionsAreSet,
    exerciseLabel,
  } = useRunningSession(workoutId);

  if (!workout) {
    return <PageNotFound />;
  }

  return (
    <FormCard title={workout.name}>
      <div className="flex flex-col items-center">
        <div data-testid="circular-timer">
          <CircularTimer
            showProgressRing={!isCountingUp}
            startTimeForAnimation={startTime}
            time={time}
          />
        </div>

        {isDisplayingNextExercise && (
          <p className="my-8 font-semibold">
            Exercise Name : {exerciseLabel()}
          </p>
        )}

        {!isReady && (
          <Button className="w-full md:w-fit" onClick={readyForNextRepetition}>
            I&apos;m ready to start
          </Button>
        )}

        {isRepFinished && (
          <Button className="w-full md:w-fit" onClick={setIsFinished}>
            Set finished
          </Button>
        )}

        {isSettingRepetitions && (
          <div className="flex items-center gap-4">
            <p>Repetitions Done :</p>
            <NumberScrollWheelSelectorPopover
              label="Reps"
              max={MaxRepetitions}
              value={DefaultRepetitions}
              onValueChange={repetitionsAreSet}
            />
          </div>
        )}

        {isWorkoutFinished && (
          <Button
            className="mt-8 w-full md:w-fit"
            onClick={() => {
              console.log('Finish');
            }}
          >
            Finish session
          </Button>
        )}
      </div>
    </FormCard>
  );
};
