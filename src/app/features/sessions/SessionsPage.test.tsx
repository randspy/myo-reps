import { render, screen } from '@testing-library/react';
import { SessionsPage } from './SessionsPage';

describe('Session Page', () => {
  test('should display the correct title', () => {
    render(<SessionsPage />);

    expect(screen.getByText('TODO')).toBeInTheDocument();
  });
});
