import { fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { expect, test } from 'vitest';
import {
  UnsavedFormChangesBlocker,
  OnDirtyChange,
  OnSubmit,
} from './UnsavedFormChangesBlocker';
import { renderWithRouter } from '@/lib/test-utils';

const FormWrapper = ({ isDirty }: { isDirty: boolean }) => {
  const navigate = useNavigate();

  return (
    <UnsavedFormChangesBlocker
      render={(onDirtyChange: OnDirtyChange, onSubmit: OnSubmit) => {
        onDirtyChange(isDirty);
        return (
          <form>
            <input placeholder="Form Name" />
            <button type="button" onClick={() => navigate('/redirect-url')}>
              Navigate
            </button>
            <button
              type="submit"
              onClick={() => {
                onSubmit();
                navigate('/redirect-url');
              }}
            >
              Submit
            </button>
          </form>
        );
      }}
    />
  );
};

describe('Unsaved Form Changes Blocker', () => {
  test('blocks navigation when form is dirty', () => {
    renderWithRouter(<FormWrapper isDirty={true} />, [
      { path: '/redirect-url', element: <h2>New Page</h2> },
    ]);

    fireEvent.change(screen.getByPlaceholderText('Form Name'), {
      target: { value: 'New value' },
    });

    fireEvent.click(screen.getByText('Navigate'));

    expect(screen.queryByText('New Page')).not.toBeInTheDocument();
  });

  test('allows navigation when form is not dirty', () => {
    renderWithRouter(<FormWrapper isDirty={false} />, [
      { path: '/redirect-url', element: <h2>New Page</h2> },
    ]);

    fireEvent.click(screen.getByText('Navigate'));

    expect(screen.getByText('New Page')).toBeInTheDocument();
  });

  test('allows navigation when form is submitted', () => {
    renderWithRouter(<FormWrapper isDirty={true} />, [
      { path: '/redirect-url', element: <h2>New Page</h2> },
    ]);

    fireEvent.click(screen.getByText('Submit'));

    expect(screen.getByText('New Page')).toBeInTheDocument();
  });

  test('modal returning to the same page', () => {
    renderWithRouter(<FormWrapper isDirty={true} />, [
      { path: '/redirect-url', element: <h2>New Page</h2> },
    ]);

    fireEvent.click(screen.getByText('Navigate'));
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('New Page')).not.toBeInTheDocument();
  });

  test('modal proceeding to the next page', () => {
    renderWithRouter(<FormWrapper isDirty={true} />, [
      { path: '/redirect-url', element: <h2>New Page</h2> },
    ]);

    fireEvent.click(screen.getByText('Navigate'));
    fireEvent.click(screen.getByText('OK'));

    expect(screen.queryByText('New Page')).toBeInTheDocument();
  });
});
