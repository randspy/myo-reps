import { fireEvent, render, screen } from '@testing-library/react';
import { WorkoutsPage } from '@/app/features/workouts/components/WorkoutsPage';
import { generateWorkout } from '@/lib/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { WorkoutValue } from '@/app/core/workouts/workouts-schema';

const renderWorkoutPage = () => {
  return render(
    <MemoryRouter initialEntries={['/workouts']}>
      <Routes>
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workouts/new" element={<div>New Workout Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Workouts page', () => {
  beforeEach(() => {
    useWorkoutsStore.setState({ workouts: [] });
  });

  describe('when there are workouts present', () => {
    let workouts: WorkoutValue[];

    beforeEach(() => {
      workouts = [
        generateWorkout({
          id: '1',
          position: 0,
          name: 'Upper body',
        }),
      ];
      useWorkoutsStore.setState({ workouts });
      renderWorkoutPage();
    });

    test('renders workouts list component', () => {
      workouts.forEach((workout) => {
        expect(screen.getByText(workout.name)).toBeInTheDocument();
      });
    });

    test("that it doesn't centers the add button when there are workouts present", () => {
      expect(screen.getByTestId('workouts-page-container')).not.toHaveClass(
        'justify-center',
      );
    });
  });

  test('that it centers the add button when no workouts present', () => {
    renderWorkoutPage();

    expect(screen.getByTestId('workouts-page-container')).toHaveClass(
      'justify-center',
    );
  });

  test('navigates to the new exercise page when the add new exercise button is clicked', () => {
    renderWorkoutPage();

    fireEvent.click(
      screen.getByRole('link', {
        name: 'Add New Workout',
      }),
    );

    expect(screen.getByText('New Workout Page')).toBeInTheDocument();
  });
});
