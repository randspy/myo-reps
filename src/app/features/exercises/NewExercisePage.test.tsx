import { screen, fireEvent } from '@testing-library/react';
import { Mock } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { NewExercisePage } from './NewExercisePage';
import { AppStore, renderWithProviders } from '@/lib/test-utils';
import { ExerciseFormValues } from '@/app/core/exercises/exercises-schema';

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
  }: {
    onSubmit: (values: ExerciseFormValues) => void;
    onCancel: () => void;
  }) => (
    <div>
      <button
        data-testid="save"
        onClick={() =>
          onSubmit({
            name: 'Mock Push up',
          })
        }
      >
        Save
      </button>
      <button
        data-testid="cancel"
        onClick={() => {
          onCancel();
        }}
      >
        Cancel
      </button>
    </div>
  ),
}));

describe('New exercise page', () => {
  let store: AppStore;

  it('should call dispatchAdd and navigate on form submission', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter>
        <NewExercisePage />
      </MemoryRouter>,
    ).store;

    fireEvent.click(screen.getByTestId('save'));

    expect(mockNavigate).toHaveBeenCalledWith('/exercises');
    expect(store.getState().exercises.values[0].name).toEqual('Mock Push up');
  });

  it('should navigate to /exercises on cancel', () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    store = renderWithProviders(
      <MemoryRouter>
        <NewExercisePage />
      </MemoryRouter>,
    ).store;

    fireEvent.click(screen.getByTestId('cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('/exercises');
    expect(store.getState().exercises.values).toEqual([]);
  });
});
