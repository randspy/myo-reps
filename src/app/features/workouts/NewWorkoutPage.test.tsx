import { screen, fireEvent } from '@testing-library/react';
import { Mock } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { AppStore, renderWithProviders } from '@/lib/test-utils';
import { ChildrenFunction } from '@/app/ui/UnsavedFormChangesBlocker';
import { WorkoutFormValues } from '@/app/core/workouts/workouts-schema';
import { NewWorkoutPage } from './NewWorkoutPage';

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
  UnsavedFormChangesBlocker: ({ children }: { children: ChildrenFunction }) =>
    children(mockOnDirtyChange, mockOnSubmit),
}));

describe('New workout page', () => {
  let store: AppStore;

  test('call dispatchAdd and navigate on form submission', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter>
        <NewWorkoutPage />
      </MemoryRouter>,
    ).store;

    fireEvent.click(screen.getByText('Save'));

    expect(mockNavigate).toHaveBeenCalledWith('/workouts');
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(store.getState().workouts.values[0].name).toEqual('Mock Upper body');
  });

  test('navigate to /exercises on cancel', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter>
        <NewWorkoutPage />
      </MemoryRouter>,
    ).store;

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('/workouts');
    expect(store.getState().exercises.values).toEqual([]);
  });

  test('block unsaved changes', () => {
    store = renderWithProviders(
      <MemoryRouter>
        <NewWorkoutPage />
      </MemoryRouter>,
    ).store;

    fireEvent.click(screen.getByText('Simulate dirty change'));

    expect(mockOnDirtyChange).toHaveBeenCalledWith(true);
  });
});
