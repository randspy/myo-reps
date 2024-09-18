import { screen, fireEvent, act, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RunningSessionPage } from './RunningSessionPage';
import {
  generateExercise,
  generateWorkout,
  renderWithProviders,
} from '@/lib/test-utils';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import {
  DefaultRepetitions,
  TimeBetweenExercisesInSeconds,
} from '@/app/core/exercises/domain/exercises.config';

const renderRunningSessionPage = (
  exercises: ExerciseValue[],
  workouts: WorkoutValue[],
) => {
  return renderWithProviders(
    <MemoryRouter initialEntries={['/running-session?workoutId=workout-1']}>
      <Routes>
        <Route path="/running-session" element={<RunningSessionPage />} />
        <Route path="/sessions" element={<div>Sessions Page</div>} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        exercises: {
          values: exercises,
        },
        workouts: {
          values: workouts,
        },
      },
    },
  );
};

describe('RunningSessionPage', () => {
  let exercises: ExerciseValue[];
  let workouts: WorkoutValue[];

  beforeEach(() => {
    exercises = [
      generateExercise({
        id: 'exercise-1',
        name: 'Push-up',
        position: 0,
        usage: [{ id: 'workout-1' }],
      }),
      generateExercise({
        id: 'exercise-2',
        name: 'Squats',
        position: 1,
      }),
    ];

    workouts = [
      generateWorkout({
        id: 'workout-1',
        name: 'Morning Workout',
        exercises: [{ id: '1', exerciseId: 'exercise-1', sets: 1 }],
      }),
    ];
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders page not found when workout is not found', () => {
    renderRunningSessionPage([], []);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  test('user arrived on the page', () => {
    renderRunningSessionPage(exercises, workouts);

    advanceTimeInSeconds(2);

    expect(screen.getByText("I'm ready to start")).toBeInTheDocument();
    expect(screen.getByText('Morning Workout')).toBeInTheDocument();
    expect(
      screen.getByText('Exercise Name : Push-up ( 1 / 1 )'),
    ).toBeInTheDocument();
    expect(getByTextInCircularTimer('2')).toBeInTheDocument();
  });

  test('user is ready', () => {
    renderRunningSessionPage(exercises, workouts);

    advanceTimeInSeconds(5);
    fireEvent.click(screen.getByText("I'm ready to start"));
    advanceTimeInSeconds(1);

    expect(screen.queryByText("I'm ready to start")).not.toBeInTheDocument();
    expect(getByTextInCircularTimer('9')).toBeInTheDocument();
  });

  test('user is ready after passing the time of the count down', () => {
    renderRunningSessionPage(exercises, workouts);

    advanceTimeInSeconds(TimeBetweenExercisesInSeconds);
    fireEvent.click(screen.getByText("I'm ready to start"));
    advanceTimeInSeconds(1);

    expect(screen.queryByText("I'm ready to start")).not.toBeInTheDocument();
    expect(getByTextInCircularTimer('0')).toBeInTheDocument();
  });

  test('user execute a repetition', () => {
    renderRunningSessionPage(exercises, workouts);

    fireEvent.click(screen.getByText("I'm ready to start"));
    advanceTimeInSeconds(TimeBetweenExercisesInSeconds + 1);

    expect(screen.getByText('Set finished')).toBeInTheDocument();
  });

  test('user finished a set', () => {
    renderRunningSessionPage(exercises, workouts);

    fireEvent.click(screen.getByText("I'm ready to start"));
    advanceTimeInSeconds(TimeBetweenExercisesInSeconds + 1);
    fireEvent.click(screen.getByText('Set finished'));

    expect(screen.queryByText('Repetition finished')).not.toBeInTheDocument();
    expect(screen.getByText('Repetitions Done :')).toBeInTheDocument();
    expect(screen.getByText(DefaultRepetitions)).toBeInTheDocument();
  });

  test('user selected last set of last exercise', () => {
    renderRunningSessionPage(exercises, workouts);

    actionsForOneSet();
    advanceTimeInSeconds(TimeBetweenExercisesInSeconds);

    expect(screen.queryByText('Repetitions Done :')).not.toBeInTheDocument();
    expect(screen.getByText('Finish session')).toBeInTheDocument();
    expect(getByTextInCircularTimer('0')).toBeInTheDocument();
  });

  test('user does multiply sets of one exercise', () => {
    workouts[0].exercises[0].sets = 3;

    renderRunningSessionPage(exercises, workouts);

    actionsForOneSet();

    expect(screen.queryByText('Repetitions Done :')).not.toBeInTheDocument();
    expect(
      screen.getByText('Exercise Name : Push-up ( 2 / 3 )'),
    ).toBeInTheDocument();
    expect(screen.getByText("I'm ready to start")).toBeInTheDocument();
  });

  test('user does multiply exercises', () => {
    workouts[0].exercises.push({
      id: '2',
      exerciseId: 'exercise-2',
      sets: 1,
    });

    exercises[1].usage = [{ id: 'workout-1' }];

    renderRunningSessionPage(exercises, workouts);

    actionsForOneSet();

    expect(screen.queryByText('Repetitions Done :')).not.toBeInTheDocument();
    expect(
      screen.getByText('Exercise Name : Squats ( 1 / 1 )'),
    ).toBeInTheDocument();
  });

  test('user finishes the session and navigates to /sessions', async () => {
    renderRunningSessionPage(exercises, workouts);

    actionsForOneSet();

    fireEvent.click(screen.getByText('Finish session'));

    expect(screen.getByText('Sessions Page')).toBeInTheDocument();
  });
});

function getByTextInCircularTimer(text: string) {
  return within(screen.getByTestId('circular-timer')).getByText(text);
}

function actionsForOneSet() {
  fireEvent.click(screen.getByText("I'm ready to start"));

  act(() => {
    vi.advanceTimersByTime(TimeBetweenExercisesInSeconds * 1000);
  });

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  fireEvent.click(screen.getByText('Set finished'));

  selectRepetitions(DefaultRepetitions + 1);
}

function selectRepetitions(value: number) {
  fireEvent.click(screen.getByText(DefaultRepetitions));
  fireEvent.click(screen.getByText(value));
}

// vi.advanceTimersByTime doesn't trigger setInterval callback for each second
function advanceTimeInSeconds(time: number) {
  for (let i = 0; i < time; i++) {
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  }
}
