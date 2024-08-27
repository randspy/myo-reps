import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { WorkoutForm } from '@/app/features/workouts/WorkoutForm';
import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from '@/app/core/exercises/exercises-slice';
import { v4 } from 'uuid';
import { generateExercise } from '@/lib/test-utils';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

const initialState = {
  exercises: {
    values: [
      generateExercise({
        id: '1',
        name: 'Push-up',
      }),
      generateExercise({
        id: '2',
        name: 'Pull-up',
        hidden: true,
      }),
    ],
  },
};

const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
  },
  preloadedState: initialState,
});

describe('Workout form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the form correctly', () => {
    render(
      <Provider store={store}>
        <WorkoutForm onSubmit={() => {}} />
      </Provider>,
    );

    expect(screen.getByLabelText('Workout Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Add Exercise')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('adds a new exercise when "Add Exercise" button is clicked', () => {
    render(
      <Provider store={store}>
        <WorkoutForm onSubmit={() => {}} />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Add Exercise'));
    expect(screen.getByText('Select Exercise')).toBeInTheDocument();
  });

  test('select the exercise', () => {
    render(
      <Provider store={store}>
        <WorkoutForm onSubmit={() => {}} />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Add Exercise'));
    fireEvent.click(screen.getByText('Select Exercise'));

    expect(screen.getByText('Push-up')).toBeInTheDocument();
    expect(screen.queryByText('Pull-up')).not.toBeInTheDocument();
  });

  test('submits the form when "Save" button is clicked', async () => {
    const onSubmit = vi.fn();
    const id = '16281fc7-56d7-4cba-b5c0-d3c3856ca604';
    vi.mocked(v4).mockImplementation(() => id);

    render(
      <Provider store={store}>
        <WorkoutForm onSubmit={onSubmit} />
      </Provider>,
    );

    fireEvent.change(screen.getByLabelText('Workout Name'), {
      target: { value: 'Upper body workout' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Workout description' },
    });

    fireEvent.click(screen.getByText('Add Exercise'));
    fireEvent.click(screen.getByText('Select Exercise'));
    fireEvent.click(screen.getByText('Push-up'));
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));

    fireEvent.submit(screen.getByText('Save'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Upper body workout',
        description: 'Workout description',
        exercises: [
          {
            id,
            exerciseId: '1',
            sets: 2,
          },
        ],
      });
    });
  });

  test('deletes an exercise when "Delete" button is clicked', () => {
    render(
      <Provider store={store}>
        <WorkoutForm onSubmit={() => {}} />
      </Provider>,
    );

    fireEvent.click(screen.getByText('Add Exercise'));
    fireEvent.click(screen.getByText('Select Exercise'));
    fireEvent.click(screen.getByText('Push-up'));
    fireEvent.click(screen.getByLabelText('Delete exercise'));

    expect(screen.queryByText('Push-up')).not.toBeInTheDocument();
  });
});
