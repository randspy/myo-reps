import { render } from '@testing-library/react';
import { ExerciseValue } from '@/features/exercises/exercises-schema';
import React from 'react';
import { ExerciseList } from './ExerciseList';

describe('ExerciseList', () => {
  const exercises: ExerciseValue[] = [
    { id: '1', name: 'Exercise 1' },
    { id: '2', name: 'Exercise 2' },
    { id: '3', name: 'Exercise 3' },
  ];

  it('renders the list of exercises', () => {
    const { getByText } = render(<ExerciseList exercises={exercises} />);

    exercises.forEach((exercise) => {
      const exerciseElement = getByText(exercise.name);
      expect(exerciseElement).toBeInTheDocument();
    });
  });
});
