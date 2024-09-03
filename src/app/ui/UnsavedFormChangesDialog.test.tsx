import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/react';
import { UnsavedFormChangesDialog } from '@/app/ui/UnsavedFormChangesDialog';

describe('Unsaved form changes dialog', () => {
  test('renders the component', () => {
    render(
      <UnsavedFormChangesDialog open={true} cancel={vi.fn()} ok={vi.fn()} />,
    );

    expect(
      screen.getByText(
        "Are you sure you don't want to keep the modifications?",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText('This action cannot be undone.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  test('does not render the dialog when open is false', () => {
    render(
      <UnsavedFormChangesDialog open={false} cancel={vi.fn()} ok={vi.fn()} />,
    );

    expect(
      screen.queryByText(
        "Are you sure you don't want to keep the modifications?",
      ),
    ).not.toBeInTheDocument();
  });

  test('calls cancel callback when Cancel button is clicked', () => {
    const cancelMock = vi.fn();
    render(
      <UnsavedFormChangesDialog open={true} cancel={cancelMock} ok={vi.fn()} />,
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(cancelMock).toHaveBeenCalledTimes(1);
  });

  test('calls ok callback when OK button is clicked', () => {
    const okMock = vi.fn();
    render(
      <UnsavedFormChangesDialog open={true} cancel={vi.fn()} ok={okMock} />,
    );

    fireEvent.click(screen.getByText('OK'));
    expect(okMock).toHaveBeenCalledTimes(1);
  });
});
