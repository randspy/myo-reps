import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseComboBox } from '@/app/workouts/ExerciseComboBox';

describe('ExerciseComboBox', () => {
  const exercises = [
    { id: '1', name: 'Push-up' },
    { id: '2', name: 'Squat' },
    { id: '3', name: 'Pull-up' },
  ];
  test('renders the component', () => {
    render(
      <ExerciseComboBox
        items={exercises}
        onSelect={() => true}
        selected={exercises[0]}
      />,
    );

    const comboBoxElement = screen.getByRole('combobox');
    expect(comboBoxElement).toBeInTheDocument();
  });

  test('displays the selected exercise', () => {
    render(
      <ExerciseComboBox
        items={exercises}
        onSelect={() => true}
        selected={exercises[0]}
      />,
    );

    const comboBoxElement = screen.getByRole('combobox');
    expect(comboBoxElement).toHaveTextContent('Push-up');
  });

  test('calls the onSelect callback when exercise is selected', () => {
    const onSelectMock = vi.fn();
    render(
      <ExerciseComboBox
        items={exercises}
        onSelect={onSelectMock}
        selected={exercises[0]}
      />,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Squat'));

    expect(onSelectMock).toHaveBeenCalledWith({ id: '2', name: 'Squat' });
  });

  test('filters the exercise list based on user input', () => {
    render(
      <ExerciseComboBox
        items={exercises}
        selected={undefined}
        onSelect={() => true}
      />,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.change(screen.getByPlaceholderText('Search Exercise'), {
      target: { value: 'Pu' },
    });

    expect(screen.queryByText('Push-up')).toBeInTheDocument();
    expect(screen.queryByText('Pull-up')).toBeInTheDocument();
    expect(screen.queryByText('Squat')).not.toBeInTheDocument();
  });
});
