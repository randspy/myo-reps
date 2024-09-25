import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { vi } from 'vitest';

const mockOnDelete = vi.fn();
const mockOnOpenChange = vi.fn();

const defaultProps = {
  open: true,
  onOpenChange: mockOnOpenChange,
  title: 'Delete Confirmation',
  description: 'Are you sure you want to delete this item?',
  onDelete: mockOnDelete,
};

const renderDeleteConfirmationDialog = (
  props: Partial<typeof defaultProps> = {},
) => {
  return render(
    <DeleteConfirmationDialog {...defaultProps} {...props}>
      <button>Delete</button>
    </DeleteConfirmationDialog>,
  );
};

describe('DeleteConfirmationDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dialog when open is true', () => {
    renderDeleteConfirmationDialog();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this item?'),
    ).toBeInTheDocument();
  });

  it('does not render the dialog when open is false', () => {
    renderDeleteConfirmationDialog({ open: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onDelete when the confirm button is clicked', () => {
    renderDeleteConfirmationDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenChange when the cancel button is clicked', () => {
    renderDeleteConfirmationDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
