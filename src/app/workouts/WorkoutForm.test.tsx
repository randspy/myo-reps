import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { WorkoutForm } from '@/app/workouts/WorkoutForm';
import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from '@/features/exercises/exercises-slice';
import { v4 } from 'uuid';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

const initialState = {
  exercises: {
    values: [{ id: '1', name: 'Push-up', description: 'Push up description' }],
  },
};

const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
  },
  preloadedState: initialState,
});

describe('WorkoutForm', () => {
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
});
