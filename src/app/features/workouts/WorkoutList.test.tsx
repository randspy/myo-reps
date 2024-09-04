import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from '@/app/core/workouts/workouts-slice';
import { WorkoutList } from './WorkoutList';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';
import { generateWorkout } from '@/lib/test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const initialState = {
  workouts: {
    values: [
      generateWorkout({
        id: '1',
        position: 0,
        name: 'Upper body',
      }),
    ],
  },
};

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
  preloadedState: initialState,
});

const editWorkout = vi.fn();
const deleteWorkout = vi.fn();

vi.mock('@/app/features/workouts/EditWorkoutDialog', () => ({
  EditWorkoutDialog: ({ workout }: { workout: WorkoutValue }) => {
    editWorkout(workout);
    return <div></div>;
  },
}));

vi.mock('@/app/features/workouts/DeleteWorkoutDialog', () => ({
  DeleteWorkoutDialog: ({ workout }: { workout: WorkoutValue }) => {
    deleteWorkout(workout);
    return <div></div>;
  },
}));

describe('Workout list', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/workouts']}>
          <Routes>
            <Route path="/workouts" element={<WorkoutList />} />
            <Route
              path="/workouts/:id"
              element={<div>Mock Edit Workout</div>}
            />
            <Route path="/sessions/new" element={<div>Mock New Session</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  });

  it('renders the list of workouts', () => {
    initialState.workouts.values.forEach((workouts) => {
      expect(screen.getByText(workouts.name)).toBeInTheDocument();
    });
  });

  it('pass through workouts to child components', async () => {
    expect(deleteWorkout).toHaveBeenCalledWith(initialState.workouts.values[0]);
  });

  it('redirect to edit page', () => {
    fireEvent.click(screen.getAllByLabelText('Edit workout')[0]);
    expect(screen.getByText('Mock Edit Workout')).toBeInTheDocument();
  });

  it('redirect to new session page for a given workout', () => {
    fireEvent.click(screen.getByLabelText('Start workout'));
    expect(screen.getByText('Mock New Session')).toBeInTheDocument();
  });
});
