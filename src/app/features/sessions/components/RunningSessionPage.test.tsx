import {
  screen,
  fireEvent,
  act,
  within,
  render,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RunningSessionPage } from './RunningSessionPage';
import { generateExercise, generateWorkout } from '@/lib/test-utils';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { WorkoutValue } from '@/app/core/workouts/workouts-types';
import {
  DefaultRepetitions,
  TimeBetweenExercisesInSeconds,
} from '@/app/core/exercises/domain/exercises-config';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { useSessionsStore } from '@/app/features/sessions/store/sessions-store';
import { v4 } from 'uuid';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

const renderRunningSessionPage = (
  exercises: ExerciseValue[],
  workouts: WorkoutValue[],
) => {
  useWorkoutsStore.setState({ workouts });
  useExercisesStore.setState({ exercises });
  useSessionsStore.setState({ sessions: [] });

  return render(
    <MemoryRouter initialEntries={['/running-session?workoutId=workout-1']}>
      <Routes>
        <Route path="/running-session" element={<RunningSessionPage />} />
        <Route path="/sessions" element={<div>Sessions Page</div>} />
      </Routes>
    </MemoryRouter>,
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

    expect(getByTextInTimer('02')).toBeInTheDocument();
    expect(screen.getByText('Push-up')).toBeInTheDocument();
    expect(
      screen.getByText('Waiting for user to be ready'),
    ).toBeInTheDocument();
    expect(screen.getByText('Morning Workout')).toBeInTheDocument();
    expect(screen.getByText("I'm ready to start")).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('user is ready', () => {
    renderRunningSessionPage(exercises, workouts);

    advanceTimeInSeconds(5);
    fireEvent.click(screen.getByText("I'm ready to start"));
    advanceTimeInSeconds(1);

    expect(
      getByTextInTimer(
        `${(TimeBetweenExercisesInSeconds - 1).toString().padStart(2, '0')}`,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("I'm ready to start")).not.toBeInTheDocument();
    expect(
      screen.getByText('Counting down before starting'),
    ).toBeInTheDocument();
  });

  test('user is executing a set', () => {
    renderRunningSessionPage(exercises, workouts);

    advanceTimeInSeconds(TimeBetweenExercisesInSeconds);
    fireEvent.click(screen.getByText("I'm ready to start"));
    advanceTimeInSeconds(TimeBetweenExercisesInSeconds);

    expect(
      screen.queryByText('Counting down before starting'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Exercise is ongoing')).toBeInTheDocument();
    expect(screen.getByText('Set finished')).toBeInTheDocument();
  });

  test('user finished a set', () => {
    renderRunningSessionPage(exercises, workouts);

    fireEvent.click(screen.getByText("I'm ready to start"));
    advanceTimeInSeconds(TimeBetweenExercisesInSeconds + 1);
    fireEvent.click(screen.getByText('Set finished'));

    expect(screen.queryByText('Exercise is ongoing')).not.toBeInTheDocument();
    expect(screen.queryByText('Set finished')).not.toBeInTheDocument();
    expect(screen.getByText('Executed Repetitions')).toBeInTheDocument();
  });

  test('user is selecting repetitions', () => {
    renderRunningSessionPage(exercises, workouts);

    actionsForOneSet();
    advanceTimeInSeconds(1);

    expect(screen.queryByText('Executed Repetitions')).not.toBeInTheDocument();
    expect(screen.getByText('Finish session')).toBeInTheDocument();
  });

  test('user finishes the session and navigates to /sessions', async () => {
    const id = 'd6bf796f-f832-40b5-841c-010c244b92b1';
    vi.mocked(v4).mockImplementation(() => id);

    renderRunningSessionPage(exercises, workouts);

    actionsForOneSet();

    fireEvent.click(screen.getByText('Finish session'));

    await waitFor(() => {
      expect(screen.getByText('Sessions Page')).toBeInTheDocument();
      expect(useSessionsStore.getState().sessions).toEqual([
        {
          events: [
            { type: 'waiting-for-user-to-be-ready' },
            { type: 'counting-down-when-ready' },
            { type: 'starting-exercise' },
            { type: 'finished-set' },
            {
              exerciseId: 'exercise-1',
              repetitions: 6,
              type: 'setting-repetitions',
            },
            { type: 'finishing-workout' },
          ],
          id,
          startDate: expect.any(Date),
          workoutId: 'workout-1',
        },
      ]);
    });
  });
});

function getByTextInTimer(text: string) {
  return within(screen.getByTestId('timer')).getByText(text);
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
