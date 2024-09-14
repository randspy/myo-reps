import { screen, fireEvent } from '@testing-library/react';
import { Mock } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { NewExercisePage } from './NewExercisePage';
import { AppStore, renderWithProviders } from '@/lib/test-utils';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';
import { ChildrenFunction } from '@/app/ui/UnsavedFormChangesBlocker';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/app/features/exercises/ExerciseForm', () => ({
  ExerciseForm: ({
    onSubmit,
    onCancel,
    onDirtyChange,
  }: {
    onSubmit: (values: ExerciseFormValues) => void;
    onCancel: () => void;
    onDirtyChange: (value: boolean) => void;
  }) => (
    <div>
      <button
        onClick={() =>
          onSubmit({
            name: 'Mock Push up',
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

describe('New exercise page', () => {
  let store: AppStore;

  test('call dispatchAdd and navigate on form submission', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter>
        <NewExercisePage />
      </MemoryRouter>,
    ).store;

    fireEvent.click(screen.getByText('Save'));

    expect(mockNavigate).toHaveBeenCalledWith('/exercises');
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(store.getState().exercises.values[0].name).toEqual('Mock Push up');
  });

  test('navigate to /exercises on cancel', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter>
        <NewExercisePage />
      </MemoryRouter>,
    ).store;

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('/exercises');
    expect(store.getState().exercises.values).toEqual([]);
  });

  test('block unsaved changes', () => {
    store = renderWithProviders(
      <MemoryRouter>
        <NewExercisePage />
      </MemoryRouter>,
    ).store;

    fireEvent.click(screen.getByText('Simulate dirty change'));

    expect(mockOnDirtyChange).toHaveBeenCalledWith(true);
  });
});
