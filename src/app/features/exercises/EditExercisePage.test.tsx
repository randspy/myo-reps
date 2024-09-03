import { screen, fireEvent } from '@testing-library/react';
import { Mock } from 'vitest';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import {
  AppStore,
  generateExercise,
  renderWithProviders,
} from '@/lib/test-utils';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';
import { RenderFunction } from '@/app/ui/UnsavedFormChangesBlocker';
import { EditExercisePage } from './EditExercisePage';

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
  UnsavedFormChangesBlocker: ({ render }: { render: RenderFunction }) =>
    render(mockOnDirtyChange, mockOnSubmit),
}));

const initialState = {
  exercises: {
    values: [
      generateExercise({
        id: '1',
        position: 0,
        name: 'Push-up',
      }),
    ],
  },
};

describe('Edit exercise page', () => {
  let store: AppStore;

  it('update exercise', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<EditExercisePage />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState: initialState,
      },
    ).store;

    fireEvent.click(screen.getByText('Save'));

    expect(mockNavigate).toHaveBeenCalledWith('/exercises');
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(store.getState().exercises.values[0].name).toEqual('Mock Push up');
  });

  it('navigate to /exercises on cancel', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<EditExercisePage />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState: initialState,
      },
    ).store;

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('/exercises');
    expect(store.getState().exercises.values[0].name).toEqual('Push-up');
  });

  it('block unsaved changes', () => {
    store = renderWithProviders(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:id" element={<EditExercisePage />} />
        </Routes>
      </MemoryRouter>,
      {
        preloadedState: initialState,
      },
    ).store;

    fireEvent.click(screen.getByText('Simulate dirty change'));

    expect(mockOnDirtyChange).toHaveBeenCalledWith(true);
  });
});
