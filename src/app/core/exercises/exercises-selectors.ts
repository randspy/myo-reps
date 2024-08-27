import { createSelector } from 'reselect';
import { RootState } from '@/store/store';

const selectAllExercises = (state: RootState) => state.exercises.values;

export const selectActiveExercises = createSelector(
  [selectAllExercises],
  (exercises) => exercises.filter((exercise) => !exercise.hidden),
);
