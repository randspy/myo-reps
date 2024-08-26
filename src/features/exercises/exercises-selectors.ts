import { createSelector } from 'reselect';
import { RootState } from '@/store/store';

const selectAllExercises = (state: RootState) => state.exercises.values;

export const selectVisibleExercises = createSelector(
  [selectAllExercises],
  (exercises) => exercises.filter((exercise) => !exercise.hidden),
);
