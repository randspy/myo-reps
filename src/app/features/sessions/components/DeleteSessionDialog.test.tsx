import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteSessionDialog } from './DeleteSessionDialog';
import { generateSession, generateWorkout } from '@/lib/test-utils';
import { useSessionsStore } from '@/app/features/sessions/store/sessions-store';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';
import { SessionValue } from '@/app/features/sessions/sessions-types';

const renderDeleteSessionDialog = (session: SessionValue) => {
  return render(<DeleteSessionDialog session={session} />);
};

describe('DeleteSessionDialog', () => {
  const workout = generateWorkout({ id: 'workout1', name: 'Test Workout' });
  const session = generateSession({
    id: '1',
    workoutId: workout.id,
    startDate: new Date('2023-04-01T10:00:00'),
  });

  beforeEach(() => {
    useSessionsStore.setState({ sessions: [session] });
    useWorkoutsStore.setState({ workouts: [workout] });
  });

  it('renders the delete button', () => {
    renderDeleteSessionDialog(session);

    expect(screen.getByLabelText('Delete session')).toBeInTheDocument();
  });

  it('opens the dialog when the delete button is clicked', () => {
    renderDeleteSessionDialog(session);

    fireEvent.click(screen.getByLabelText('Delete session'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this session?'),
    ).toBeInTheDocument();
  });

  it('closes the dialog when the cancel button is clicked', () => {
    renderDeleteSessionDialog(session);

    fireEvent.click(screen.getByLabelText('Delete session'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('deletes the session and closes the dialog when the delete button is clicked', async () => {
    renderDeleteSessionDialog(session);

    fireEvent.click(screen.getByLabelText('Delete session'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      const sessions = useSessionsStore.getState().sessions;
      expect(sessions.length).toBe(0);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
