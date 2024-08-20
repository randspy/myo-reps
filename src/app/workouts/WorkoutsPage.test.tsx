import { render, screen } from '@testing-library/react';
import { WorkoutsPage } from '@/app/workouts/WorkoutsPage';
import { Provider } from 'react-redux';
import { store as emptyStore } from '@/store/store';
import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from '@/features/workouts/workouts-slice';

const initialState = {
  workouts: {
    values: [
      { id: '1', name: 'Upper body', description: 'Upper body description' },
      { id: '2', name: 'Lower body', description: 'Lower body description' },
    ],
  },
};

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
  preloadedState: initialState,
});

describe('Workouts page', () => {
  describe('when there are workouts present', () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <WorkoutsPage />
        </Provider>,
      );
    });

    test('renders workouts list component', () => {
      initialState.workouts.values.forEach((workouts) => {
        expect(screen.getByText(workouts.name)).toBeInTheDocument();
      });
    });

    test("that it doesn't centers the add button when there are workouts present", () => {
      expect(screen.getByTestId('workouts-page-container')).not.toHaveClass(
        'justify-center',
      );
    });
  });

  test('that it centers the add button when no workouts present', () => {
    render(
      <Provider store={emptyStore}>
        <WorkoutsPage />
      </Provider>,
    );
    expect(screen.getByTestId('workouts-page-container')).toHaveClass(
      'justify-center',
    );
  });
});
