import {
  DefaultRepetitions,
  MaxRepetitions,
} from '@/app/core/exercises/domain/exercises-config';
import { Timer } from '@/app/ui/Timer';
import { FormCard } from '@/app/ui/FormCard';
import { NumberScrollWheelSelectorPopover } from '@/app/ui/NumberScrollWheelSelectorPopover';
import { PageNotFound } from '@/app/ui/PageNotFound';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRunningSession } from '../hooks/useRunningSession';
import { selectExerciseByWorkoutIdAsMap } from '@/app/core/exercises/store/exercises-selectors';
import { useSession } from '@/app/features/sessions/hooks/useSession';
import { createSession } from '../domain/sessions-domain';

export const RunningSessionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const workoutId = searchParams.get('workoutId');
  const exercises = selectExerciseByWorkoutIdAsMap(workoutId);
  const { dispatchAddSession } = useSession();

  const {
    events,
    workout,
    exercisesLeftToDo,
    time,
    readyForNextRepetition,
    setIsFinished,
    repetitionsAreSet,
    isWaitingToBeReady,
    isCountingDownBeforeStarting,
    isExerciseOngoing,
    isRepFinished,
    isWorkoutFinished,
  } = useRunningSession(workoutId);

  if (!workout) {
    return <PageNotFound />;
  }

  return (
    <FormCard title={workout.name}>
      <div className="flex flex-col items-center">
        <div data-testid="circular-timer">
          <Timer time={time} />
        </div>

        <div className="scrollbar-gutter my-16 -mr-3 max-h-[16rem] w-full overflow-y-auto pr-2">
          <div className="-pr-4">
            {exercisesLeftToDo?.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`-mr-4 mb-2 flex w-full items-center justify-between border p-4 ${index === 0 && 'border-ring-secondary'}`}
              >
                <span className="truncate">
                  {exercises.get(exercise.exerciseId)?.name}
                </span>
                <span>{exercise.sets}</span>
              </div>
            ))}
          </div>
        </div>

        {isWaitingToBeReady && (
          <>
            <p className="mb-4 text-sm">Waiting for user to be ready</p>
            <Button className="w-full" onClick={readyForNextRepetition}>
              I&apos;m ready to start
            </Button>
          </>
        )}

        {isCountingDownBeforeStarting && (
          <p className="mb-4 text-sm">Counting down before starting</p>
        )}

        {isExerciseOngoing && (
          <>
            <p className="mb-4 text-sm">Exercise is ongoing</p>
            <Button className="w-full" onClick={setIsFinished}>
              Set finished
            </Button>
          </>
        )}

        {isRepFinished && (
          <div className="flex w-full items-center justify-between">
            <p>Executed Repetitions</p>
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
            className="mt-8 w-full"
            onClick={() => {
              dispatchAddSession(createSession(workoutId!, events));
              navigate('/sessions');
            }}
          >
            Finish session
          </Button>
        )}

        <Button
          className="mt-2 w-full bg-cancel"
          onClick={() => {
            navigate('/sessions');
          }}
        >
          Cancel
        </Button>
      </div>
    </FormCard>
  );
};
