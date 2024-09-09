import { render, screen } from '@testing-library/react';
import { Mock } from 'vitest';
import { ErrorPage } from './ErrorPage';
import { useRouteError } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  useRouteError: vi.fn(),
}));

describe('ErrorPage', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should render the unexpected error message when there is no error', () => {
    (useRouteError as Mock).mockReturnValue(null);

    render(<ErrorPage />);

    expect(
      screen.getByText('Sorry, an unexpected error has occurred.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Status:')).toBeNull();
    expect(screen.queryByText('Status Text:')).toBeNull();
    expect(screen.queryByText('Message:')).toBeNull();
  });

  test('should render the error details when error object is provided', () => {
    const mockError = {
      status: 404,
      statusText: 'Not Found',
      message: 'The page you are looking for does not exist.',
    };
    (useRouteError as Mock).mockReturnValue(mockError);

    render(<ErrorPage />);

    expect(
      screen.getByText('Sorry, an unexpected error has occurred.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Status: 404')).toBeInTheDocument();
    expect(screen.getByText('Status Text: Not Found')).toBeInTheDocument();
    expect(
      screen.getByText('Message: The page you are looking for does not exist.'),
    ).toBeInTheDocument();
  });

  test('should render the error details with partial error information', () => {
    const mockError = {
      status: 500,
    };
    (useRouteError as Mock).mockReturnValue(mockError);

    render(<ErrorPage />);

    expect(
      screen.getByText('Sorry, an unexpected error has occurred.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Status: 500')).toBeInTheDocument();
    expect(screen.queryByText('Status Text:')).toBeNull();
    expect(screen.queryByText('Message:')).toBeNull();
  });

  test('should log the error to the console', () => {
    const mockError = {
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Something went wrong.',
    };
    (useRouteError as Mock).mockReturnValue(mockError);

    render(<ErrorPage />);

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
  });
});
