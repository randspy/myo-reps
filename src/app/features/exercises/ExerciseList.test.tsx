import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { ExerciseList } from './ExerciseList';
import { ExerciseValue } from '@/app/core/exercises/exercises-schema';
import {
  AppStore,
  generateExercise,
  renderWithProviders,
} from '@/lib/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const initialState = {
  exercises: {
    values: [
      generateExercise({
        id: '1',
        name: 'Push-up',
        position: 0,
      }),
      generateExercise({
        id: '2',
        name: 'Squats',
        position: 1,
      }),
    ],
  },
};

const deleteExercise = vi.fn();

vi.mock('@/app/features/exercises/DeleteExerciseDialog', () => ({
  DeleteExerciseDialog: ({ exercise }: { exercise: ExerciseValue }) => {
    deleteExercise(exercise);
    return <div></div>;
  },
}));

let onReorder: (values: ExerciseValue[]) => void;

vi.mock('framer-motion', () => ({
  Reorder: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Group: (props: any) => {
      onReorder = props.onReorder;
      return <div data-testid="reorder-group">{props.children}</div>;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Item: (props: any) => (
      <div {...props} data-testid="reorder-item">
        {props.children}
      </div>
    ),
  },
}));

describe('Exercise list', () => {
  let store: AppStore;

  beforeEach(() => {
    store = renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ExerciseList />} />
          <Route
            path="/exercises/:id"
            element={<div>Mock Edit Exercise</div>}
          />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState: initialState,
      },
    ).store;
  });

  test('renders the list of exercises', () => {
    initialState.exercises.values.forEach((exercise) => {
      expect(screen.getByText(exercise.name)).toBeInTheDocument();
    });
  });

  test('pass through exercises to child components', async () => {
    expect(deleteExercise).toHaveBeenCalledWith(
      initialState.exercises.values[0],
    );
  });

  test('redirect to edit page', () => {
    fireEvent.click(screen.getAllByLabelText('Edit exercise')[0]);
    expect(screen.getByText('Mock Edit Exercise')).toBeInTheDocument();
  });

  test('simulate drag and drop', async () => {
    act(() => {
      onReorder([
        initialState.exercises.values[1],
        initialState.exercises.values[0],
      ]);
    });

    await waitFor(() => {
      expect(store.getState().exercises.values).toEqual([
        { ...initialState.exercises.values[1], position: 0 },
        { ...initialState.exercises.values[0], position: 1 },
      ]);
    });
  });
});
