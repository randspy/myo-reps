import { fireEvent, screen } from '@testing-library/react';
import { WorkoutList } from './WorkoutList';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { generateWorkout, renderWithProviders } from '@/lib/test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const deleteWorkout = vi.fn();

vi.mock('@/app/features/workouts/DeleteWorkoutDialog', () => ({
  DeleteWorkoutDialog: ({ workout }: { workout: WorkoutValue }) => {
    deleteWorkout(workout);
    return <div></div>;
  },
}));

const renderWorkoutList = (workouts: WorkoutValue[]) => {
  return renderWithProviders(
    <MemoryRouter initialEntries={['/workouts']}>
      <Routes>
        <Route path="/workouts" element={<WorkoutList />} />
        <Route path="/workouts/:id" element={<div>Mock Edit Workout</div>} />
        <Route path="/sessions/new" element={<div>Mock New Session</div>} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        workouts: {
          values: workouts,
        },
      },
    },
  );
};

describe('Workout list', () => {
  let workouts: WorkoutValue[];

  beforeEach(() => {
    workouts = [
      generateWorkout({
        id: '1',
        position: 0,
        name: 'Upper body',
        exercises: [],
      }),
    ];
  });

  test('renders the list of workouts', () => {
    renderWorkoutList(workouts);

    workouts.forEach((workout) => {
      expect(screen.getByText(workout.name)).toBeInTheDocument();
    });
  });

  test('pass through workouts to child components', async () => {
    renderWorkoutList(workouts);

    expect(deleteWorkout).toHaveBeenCalledWith(workouts[0]);
  });

  test('redirect to edit page', () => {
    renderWorkoutList(workouts);

    fireEvent.click(screen.getAllByLabelText('Edit workout')[0]);
    expect(screen.getByText('Mock Edit Workout')).toBeInTheDocument();
  });

  test('redirect to new session page for a given workout', () => {
    workouts[0].exercises = [{ id: '1', exerciseId: '1', sets: 3 }];

    renderWorkoutList(workouts);

    fireEvent.click(screen.getByLabelText('Start workout'));
    expect(screen.getByText('Mock New Session')).toBeInTheDocument();
  });

  test('no redirect button to new session page when missing exercises', () => {
    renderWorkoutList(workouts);

    expect(screen.queryByText('Start workout')).not.toBeInTheDocument();
  });
});
