import { TimeBetweenExercisesInSeconds } from '@/app/core/exercises/domain/exercises-config';
import { selectWorkoutById } from '@/app/core/workouts/store/workouts-selectors';
import { WorkoutExerciseValue } from '@/app/core/workouts/workouts-types';
import { useEffect, useRef, useState } from 'react';
import { SessionEvent } from '@/app/features/sessions/sessions-types';

export const useRunningSession = (workoutId: string | null) => {
  const [events, setEvents] = useState<SessionEvent[]>([
    { type: 'waiting-for-user-to-be-ready' },
  ]);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isCountingUp, setIsCountingUp] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);

  const timeRef = useRef(0);

  const workout = selectWorkoutById(workoutId);

  const [exercisesLeftToDo, setExercisesLeftToDo] = useState<
    WorkoutExerciseValue[]
  >([]);

  useEffect(() => {
    if (workout) {
      setExercisesLeftToDo(workout.exercises);
    }
  }, [workout]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        timeRef.current = updateTime(timeRef.current);

        if (canStartExercise()) {
          startingExercise();
        }

        setTime(updateTime);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isCountingUp]);

  const updateTime = (prevTime: number) => {
    if (isCountingUp) {
      return prevTime + 1;
    } else {
      return prevTime === 0 ? 0 : prevTime - 1;
    }
  };

  const readyForNextRepetition = () => {
    setIsCountingUp(false);

    addEvent({
      type: 'counting-down-when-ready',
    });

    let countDownTime = 0;

    if (currentSet > 0) {
      countDownTime =
        TimeBetweenExercisesInSeconds <= time
          ? 0
          : TimeBetweenExercisesInSeconds - time;
    } else {
      countDownTime = TimeBetweenExercisesInSeconds;
    }
    setTime(countDownTime);
    timeRef.current = countDownTime;
  };

  const canStartExercise = () => timeRef.current === 0 && !isCountingUp;

  const startingExercise = () => {
    addEvent({
      type: 'starting-exercise',
    });
    setIsCountingUp(true);
    setTime(0);
  };

  const setIsFinished = () => {
    addEvent({
      type: 'finished-set',
    });
    setTime(0);
  };

  const repetitionsAreSet = (repetitions: number) => {
    if (workout) {
      addEvent({
        type: 'setting-repetitions',
        repetitions,
        exerciseId: workout.exercises[currentExerciseIndex].exerciseId,
      });

      if (isLastSetForExercise()) {
        if (isLastExercise()) {
          setIsActive(false);
          setTime(0);

          addEvent({
            type: 'finishing-workout',
          });
          setExercisesLeftToDo([]);
        } else {
          addEvent({
            type: 'waiting-for-user-to-be-ready',
          });
          setCurrentExerciseIndex((prev) => prev + 1);
          setCurrentSet(0);

          removeAlreadyDoneExercise();
        }
      } else {
        addEvent({
          type: 'waiting-for-user-to-be-ready',
        });
        setCurrentSet((prev) => prev + 1);

        decreaseNumberOfSetsForExercise();
      }
    }

    function removeAlreadyDoneExercise() {
      setExercisesLeftToDo((prev) => {
        return prev?.slice(1);
      });
    }

    function decreaseNumberOfSetsForExercise() {
      setExercisesLeftToDo((prev) => {
        const [first, ...rest] = prev;
        return [
          {
            ...first,
            sets: first.sets - 1,
          },
          ...rest,
        ];
      });
    }
  };

  function isLastSetForExercise() {
    return (
      workout && currentSet === workout.exercises[currentExerciseIndex].sets - 1
    );
  }

  function isLastExercise() {
    return workout && currentExerciseIndex === workout.exercises.length - 1;
  }

  const addEvent = (event: SessionEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const isWaitingToBeReady =
    events.at(-1)?.type === 'waiting-for-user-to-be-ready';
  const isCountingDownBeforeStarting =
    events.at(-1)?.type === 'counting-down-when-ready';
  const isExerciseOngoing = events.at(-1)?.type === 'starting-exercise';
  const isRepFinished = events.at(-1)?.type === 'finished-set';
  const isWorkoutFinished = events.at(-1)?.type === 'finishing-workout';

  return {
    workout,
    events,
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
  };
};
