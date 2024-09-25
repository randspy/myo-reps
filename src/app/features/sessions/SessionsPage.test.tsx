import { render, screen } from '@testing-library/react';
import { SessionsPage } from './SessionsPage';
import { useSessionsStore } from './store/sessions-store';
import { generateSession, generateWorkout } from '@/lib/test-utils';
import { useWorkoutsStore } from '@/app/core/workouts/store/workouts-store';

describe('Session Page', () => {
  test('should display the correct title', () => {
    useSessionsStore.setState({
      sessions: [
        generateSession({
          id: '1',
          workoutId: 'w-1',
        }),
      ],
    });

    useWorkoutsStore.setState({
      workouts: [
        generateWorkout({
          id: 'w-1',
          name: 'Upper body',
        }),
      ],
    });

    render(<SessionsPage />);

    expect(screen.getByText('Upper body')).toBeInTheDocument();
  });
});
