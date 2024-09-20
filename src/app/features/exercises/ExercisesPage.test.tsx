import { fireEvent, render, screen } from '@testing-library/react';
import { ExercisesPage } from '@/app/features/exercises/ExercisesPage';
import { generateExercise } from '@/lib/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useExercisesStore } from '@/app/core/exercises/store/exercises-store';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';

const renderExercisePage = () => {
  return render(
    <MemoryRouter initialEntries={['/exercises']}>
      <Routes>
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/exercises/new" element={<div>New Exercise Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Exercises page', () => {
  beforeEach(() => {
    useExercisesStore.setState({ exercises: [] });
  });

  describe('when there are exercises present', () => {
    let exercises: ExerciseValue[];

    beforeEach(() => {
      exercises = [
        generateExercise({
          id: '1',
          position: 0,
          name: 'Push-up',
        }),
        generateExercise({
          id: '2',
          position: 1,
          name: 'Squat',
        }),
      ];
      useExercisesStore.setState({ exercises });
      renderExercisePage();
    });

    test('renders exercises list component', () => {
      exercises.forEach((exercise) => {
        expect(screen.getByText(exercise.name)).toBeInTheDocument();
      });
    });

    test("that it doesn't center the add button when there are exercises present", () => {
      expect(screen.getByTestId('exercises-page-container')).not.toHaveClass(
        'justify-center',
      );
    });
  });

  test('that it centers the add button when no exercises present', () => {
    renderExercisePage();

    expect(screen.getByTestId('exercises-page-container')).toHaveClass(
      'justify-center',
    );
  });

  test('navigates to the new exercise page when the add new exercise button is clicked', () => {
    renderExercisePage();

    fireEvent.click(
      screen.getByRole('link', {
        name: 'Add New Exercise',
      }),
    );

    expect(screen.getByText('New Exercise Page')).toBeInTheDocument();
  });
});
