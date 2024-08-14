import { act, render, screen, waitFor } from '@testing-library/react';
import { ExercisesPage } from '@/app/exercises/ExercisesPage';
import {
  ExerciseValue,
  NewExerciseFormValues,
} from '@/features/exercises/exercises-schema';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { addExercise } from '@/features/exercises/exercises-slice';

const exerciseListProps = vi.fn();
vi.mock('@/app/exercises/ExerciseList', () => ({
  ExerciseList: (props: { exercises: ExerciseValue[] }) => {
    exerciseListProps(props);
    return <div data-testid="exercise-list"></div>;
  },
}));

describe('ExercisePage', () => {
  test('renders ExerciseList component', () => {
    render(
      <Provider store={store}>
        <ExercisesPage />
      </Provider>,
    );

    const exerciseListElement = screen.getByTestId('exercise-list');
    expect(exerciseListElement).toBeInTheDocument();
  });

  test('renders AddNewExerciseDialog component', () => {
    render(
      <Provider store={store}>
        <ExercisesPage />
      </Provider>,
    );
    const addNewExerciseDialogElement = screen.getByText('Add New Exercise');
    expect(addNewExerciseDialogElement).toBeInTheDocument();
  });

  test('Sets the props of ExerciseList component', async () => {
    render(
      <Provider store={store}>
        <ExercisesPage />
      </Provider>,
    );

    const mockExerciseData: NewExerciseFormValues = {
      name: 'Exercise 1',
      description: '',
    };

    act(() => {
      store.dispatch(addExercise({ name: 'Exercise 1', description: '' }));
    });

    await waitFor(() => {
      expect(exerciseListProps).toHaveBeenLastCalledWith({
        exercises: [{ id: expect.any(String), ...mockExerciseData }],
      });
    });
  });
});
