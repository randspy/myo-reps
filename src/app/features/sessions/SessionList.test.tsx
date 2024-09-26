import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SessionList } from './SessionList';
import {
  generateSession,
  generateWorkout,
  renderWithRouter,
} from '@/lib/test-utils';
import { useSessionsStore } from './store/sessions-store';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';

describe('SessionList', () => {
  it('renders the list of sessions from newest to oldest', () => {
    useSessionsStore.setState({
      sessions: [
        generateSession({
          id: '1',
          workoutId: 'workout1',
          startDate: new Date('2023-04-01T10:00:00'),
        }),
        generateSession({
          id: '2',
          workoutId: 'workout2',
          startDate: new Date('2023-04-02T11:00:00'),
        }),
      ],
    });
    useWorkoutsStore.setState({
      workouts: [
        generateWorkout({
          id: 'workout1',
          name: 'Workout 1',
        }),
        generateWorkout({
          id: 'workout2',
          name: 'Workout 2',
        }),
      ],
    });

    renderWithRouter(<SessionList />);
    const sessionElements = screen.getAllByRole('heading', { level: 3 });
    expect(sessionElements).toHaveLength(2);

    expect(sessionElements[0]).toHaveTextContent('Workout 2');
    expect(screen.getByText('4/2/2023')).toBeInTheDocument();
    expect(screen.getByText('11:00:00 AM')).toBeInTheDocument();

    expect(sessionElements[1]).toHaveTextContent('Workout 1');
    expect(screen.getByText('4/1/2023')).toBeInTheDocument();
    expect(screen.getByText('10:00:00 AM')).toBeInTheDocument();
  });

  it('displays "No sessions" when the list is empty', () => {
    useSessionsStore.setState({ sessions: [] });
    useWorkoutsStore.setState({ workouts: [] });

    renderWithRouter(<SessionList />);

    expect(screen.getByText('No sessions')).toBeInTheDocument();
  });
});
