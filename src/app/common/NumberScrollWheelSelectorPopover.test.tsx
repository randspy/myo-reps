import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';
import { NumberScrollWheelSelectorPopover } from './NumberScrollWheelSelectorPopover';

const mockedOnValueChange = vi.fn();

describe('Opened Popover', () => {
  beforeEach(() => {
    render(
      <NumberScrollWheelSelectorPopover
        value={1}
        max={10}
        label="Sets"
        onValueChange={mockedOnValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '1' }));
  });

  afterEach(() => {
    mockedOnValueChange.mockClear();
  });

  test('renders label', () => {
    expect(screen.getByText('Sets')).toBeInTheDocument();
  });

  test('call callback when a button is clicked', () => {
    fireEvent.click(screen.getByText('5'));

    expect(mockedOnValueChange).toHaveBeenCalledWith(5);
  });

  test('closes the popover when a button is clicked', () => {
    fireEvent.click(screen.getByText('5'));

    expect(screen.queryByText('Sets')).not.toBeInTheDocument();
  });
});

test('closes the popover when clicked away', () => {
  render(
    <div>
      <NumberScrollWheelSelectorPopover
        value={1}
        label="Test Label"
        max={10}
        onValueChange={vi.fn()}
      />
      <div data-testid="outside-element">Outside Element</div>
    </div>,
  );
  fireEvent.click(screen.getByRole('button', { name: '1' }));
  fireEvent.mouseDown(screen.getByTestId('outside-element'));

  expect(screen.queryByText('Sets')).not.toBeInTheDocument();
});
