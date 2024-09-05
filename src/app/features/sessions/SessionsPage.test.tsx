import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SessionsPage } from './SessionsPage';

describe('Session Page', () => {
  it('should display the correct title', () => {
    render(<SessionsPage />);

    expect(screen.getByText('Sessions: TO BE IMPLEMENTED')).toBeInTheDocument();
  });
});
