import { TimeBetweenExercisesInSeconds } from '@/app/core/exercises/domain/exercises.config';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { selectExercisesByWorkoutId } from '@/app/core/exercises/store/exercises-selectors';
import { selectWorkoutById } from '@/app/core/workouts/store/workouts-selectors';
import { RootState } from '@/store/store';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export const useRunningSession = (workoutId: string | null) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isCountingUp, setIsCountingUp] = useState(true);
  const [isSettingRepetitions, setIsSettingRepetitions] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);
  const [isRepFinished, setIsRepFinished] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [isDisplayingNextExercise, setIsDisplayingNextExercise] =
    useState(true);
  const [startTime, setStartTime] = useState(0);
  const timeRef = useRef(0);

  const workout = useSelector(selectWorkoutById(workoutId));
  const exercises = useSelector<RootState, ExerciseValue[]>(
    selectExercisesByWorkoutId(workoutId),
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
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

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  const updateTime = (prevTime: number) => {
    if (isCountingUp) {
      return prevTime + 1;
    } else {
      return prevTime === 0 ? 0 : prevTime - 1;
    }
  };

  const readyForNextRepetition = () => {
    setIsReady(true);
    setIsCountingUp(false);

    const countDownTime =
      TimeBetweenExercisesInSeconds <= time
        ? 0
        : TimeBetweenExercisesInSeconds - time;
    setTime(countDownTime);
    setStartTime(countDownTime);
  };

  const canStartExercise = () => timeRef.current === 0 && !isCountingUp;

  const startingExercise = () => {
    setIsCountingUp(true);
    setTime(0);
    setIsRepFinished(true);
  };

  const setIsFinished = () => {
    setTime(0);
    setIsRepFinished(false);
    setIsSettingRepetitions(true);
  };

  const repetitionsAreSet = () => {
    if (workout) {
      if (currentSet !== workout.exercises[currentExerciseIndex].sets - 1) {
        setCurrentSet((prev) => prev + 1);
        setIsReady(false);
      } else {
        if (currentExerciseIndex !== workout.exercises.length - 1) {
          setCurrentExerciseIndex((prev) => prev + 1);
          setCurrentSet(0);
          setIsReady(false);
        } else {
          setIsActive(false);
          setTime(0);
          setIsWorkoutFinished(true);
          setIsDisplayingNextExercise(false);
        }
      }
      setIsSettingRepetitions(false);
    }
  };

  const exerciseLabel = () => {
    if (workout) {
      return `${exercises[currentExerciseIndex].name} ( ${
        currentSet + 1
      } / ${workout?.exercises[currentExerciseIndex].sets} )`;
    }
  };

  return {
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
  };
};
