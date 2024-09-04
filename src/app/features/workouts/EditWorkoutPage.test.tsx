import { screen, fireEvent } from '@testing-library/react';
import { Mock } from 'vitest';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import {
  AppStore,
  generateWorkout,
  renderWithProviders,
} from '@/lib/test-utils';
import { RenderFunction } from '@/app/ui/UnsavedFormChangesBlocker';
import { WorkoutFormValues } from '@/app/core/workouts/workouts-schema';
import { EditWorkoutPage } from './EditWorkoutPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/app/features/workouts/WorkoutForm', () => ({
  WorkoutForm: ({
    onSubmit,
    onCancel,
    onDirtyChange,
  }: {
    onSubmit: (values: WorkoutFormValues) => void;
    onCancel: () => void;
    onDirtyChange: (value: boolean) => void;
  }) => (
    <div>
      <button
        onClick={() =>
          onSubmit({
            name: 'Mock Upper body',
            exercises: [],
          })
        }
      >
        Save
      </button>
      <button
        onClick={() => {
          onCancel();
        }}
      >
        Cancel
      </button>
      <button onClick={() => onDirtyChange(true)}>Simulate dirty change</button>
    </div>
  ),
}));

const mockOnDirtyChange = vi.fn();
const mockOnSubmit = vi.fn();

vi.mock('@/app/ui/UnsavedFormChangesBlocker', () => ({
  UnsavedFormChangesBlocker: ({ render }: { render: RenderFunction }) =>
    render(mockOnDirtyChange, mockOnSubmit),
}));

const preloadedState = {
  workouts: {
    values: [
      generateWorkout({
        id: '1',
        position: 0,
        name: 'Upper body',
      }),
    ],
  },
};

describe('Edit workout page', () => {
  let store: AppStore;

  it('update workout', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<EditWorkoutPage />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState,
      },
    ).store;

    fireEvent.click(screen.getByText('Save'));

    expect(mockNavigate).toHaveBeenCalledWith('/workouts');
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(store.getState().workouts.values[0].name).toEqual('Mock Upper body');
  });

  it('navigate to /exercises on cancel', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<EditWorkoutPage />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState,
      },
    ).store;

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('/workouts');
    expect(store.getState().workouts.values[0].name).toEqual('Upper body');
  });

  it('block unsaved changes', () => {
    store = renderWithProviders(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<EditWorkoutPage />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState,
      },
    ).store;

    fireEvent.click(screen.getByText('Simulate dirty change'));

    expect(mockOnDirtyChange).toHaveBeenCalledWith(true);
  });

  it('should render 404 page if workout is not found', () => {
    store = renderWithProviders(
      <MemoryRouter initialEntries={['/2']}>
        <Routes>
          <Route path="/:id" element={<EditWorkoutPage />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState,
      },
    ).store;

    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});
