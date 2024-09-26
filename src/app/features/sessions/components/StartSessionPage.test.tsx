import { fireEvent, render, screen } from '@testing-library/react';
import { StartSessionPage } from './StartSessionPage';
import { generateExercise, generateWorkout } from '@/lib/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { WorkoutValue } from '@/app/core/workouts/workouts-types';
import { ExerciseValue } from '@/app/core/exercises/exercises-types';

const renderStartSessionPage = () => {
  return render(
    <MemoryRouter initialEntries={['/sessions/start?workoutId=123']}>
      <Routes>
        <Route path="/sessions/start" element={<StartSessionPage />} />
        <Route
          path="/sessions/in-progress"
          element={<div>Mock In Progress</div>}
        />
        <Route path="/workouts" element={<div>Mock Workouts</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Start Session Page', () => {
  describe('when the workout exists', () => {
    let exercises: ExerciseValue[];
    let workouts: WorkoutValue[];

    beforeEach(() => {
      exercises = [
        generateExercise({
          id: '1',
          name: 'Push-up',
          position: 0,
          usage: [{ id: '123' }],
        }),
        generateExercise({
          id: '2',
          name: 'Squats',
          position: 1,
          usage: [{ id: '123' }],
        }),
      ];

      workouts = [
        generateWorkout({
          id: '123',
          name: 'Upper body',
          exercises: [
            { id: '1', sets: 3, exerciseId: '1' },
            { id: '2', sets: 9, exerciseId: '2' },
          ],
        }),
      ];

      useExercisesStore.setState({ exercises });
      useWorkoutsStore.setState({ workouts });

      renderStartSessionPage();
    });

    test('should render the StartSessionPage component', () => {
      expect(
        screen.getByText('Start Session for Upper body'),
      ).toBeInTheDocument();
    });

    test('should display the exercises', () => {
      expect(screen.getByText('Push-up')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Squats')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
    });

    test('should redirect to /sessions/in-progress when Start Session button is clicked', () => {
      fireEvent.click(screen.getByText('Start Session'));
      expect(screen.getByText('Mock In Progress')).toBeInTheDocument();
    });

    test('should redirect to /workouts when Cancel button is clicked', () => {
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.getByText('Mock Workouts')).toBeInTheDocument();
    });
  });

  test('should display a 404 page when the workout does not exist', () => {
    useWorkoutsStore.setState({ workouts: [] });
    renderStartSessionPage();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
