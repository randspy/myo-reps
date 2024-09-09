import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ClearAppState } from './ClearAppState';
import { recreateDB } from '@/db';

vi.mock('@/db', () => ({
  recreateDB: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('Clear App State', () => {
  let originalReload: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    originalReload = window.location.reload;
  });

  test('should render the ClearAppState component', () => {
    render(<ClearAppState />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  afterEach(() => {
    window.location.reload = originalReload;
  });

  test('should call recreateDB and reload the page when the button is clicked', async () => {
    render(<ClearAppState />);

    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    fireEvent.click(screen.getByLabelText("Delete app's state"));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(recreateDB).toHaveBeenCalledTimes(1);
      expect(reloadMock).toHaveBeenCalledTimes(1);
    });
  });

  test('should close the dialog when the cancel button is clicked', () => {
    render(<ClearAppState />);

    fireEvent.click(screen.getByLabelText("Delete app's state"));
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
