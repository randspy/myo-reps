import { render, fireEvent, screen } from '@testing-library/react';
import { NumberScrollWheelSelector } from '@/app/common/NumberScrollWheelSelector';

test('renders scroll wheel', () => {
  render(
    <NumberScrollWheelSelector value={1} max={2} onValueChange={vi.fn()} />,
  );

  expect(screen.queryByRole('button', { name: '0' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '1' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '2' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '3' })).not.toBeInTheDocument();
});

test('renders selected value with default variant', () => {
  render(
    <NumberScrollWheelSelector value={1} max={2} onValueChange={vi.fn()} />,
  );

  expect(screen.getByRole('button', { name: '1' })).toHaveClass('bg-primary');
  expect(screen.getByRole('button', { name: '2' })).not.toHaveClass(
    'bg-primary',
  );
});

test('calls callback with selected value', () => {
  const onValueChange = vi.fn();
  render(
    <NumberScrollWheelSelector
      value={1}
      max={2}
      onValueChange={onValueChange}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '2' }));

  expect(onValueChange).toHaveBeenCalledWith(2);
});
