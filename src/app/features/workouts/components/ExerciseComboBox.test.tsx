import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseComboBox } from '@/app/features/workouts/components/ExerciseComboBox';
import { generateExercise } from '@/lib/test-utils';

describe('Exercise selector', () => {
  const exercises = [
    generateExercise({ id: '1', position: 0, name: 'Push-up' }),
    generateExercise({ id: '2', position: 1, name: 'Squat' }),
    generateExercise({ id: '3', position: 2, name: 'Pull-up' }),
  ];

  const selected = { id: '42', exerciseId: '1', sets: 1 };

  test('renders the component', () => {
    render(
      <ExerciseComboBox
        items={[]}
        dropdownItems={[]}
        onSelect={() => true}
        selected={undefined}
      />,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('displays the selected exercise', () => {
    render(
      <ExerciseComboBox
        items={exercises}
        dropdownItems={[]}
        onSelect={() => true}
        selected={selected}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Push-up');
  });

  test('displays the default label', () => {
    render(
      <ExerciseComboBox
        items={exercises}
        dropdownItems={[]}
        onSelect={() => true}
        selected={undefined}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Select Exercise');
  });

  test('calls the onSelect callback when exercise is selected', () => {
    const onSelectMock = vi.fn();
    render(
      <ExerciseComboBox
        items={exercises}
        dropdownItems={exercises}
        onSelect={onSelectMock}
        selected={selected}
      />,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Squat'));

    expect(onSelectMock).toHaveBeenCalledWith({
      id: '42',
      exerciseId: '2',
      sets: 1,
    });
  });

  test('displays in the dropdown items from dropdownItems prop', () => {
    render(
      <ExerciseComboBox
        items={[]}
        dropdownItems={exercises}
        onSelect={() => true}
        selected={undefined}
      />,
    );

    fireEvent.click(screen.getByRole('combobox'));

    expect(screen.queryByText('Push-up')).toBeInTheDocument();
    expect(screen.queryByText('Pull-up')).toBeInTheDocument();
    expect(screen.queryByText('Squat')).toBeInTheDocument();
  });

  test('filters the exercise list based on user input', () => {
    render(
      <ExerciseComboBox
        items={exercises}
        dropdownItems={exercises}
        selected={undefined}
        onSelect={() => true}
      />,
    );

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.change(screen.getByPlaceholderText('Search Exercise'), {
      target: { value: 'Pup' },
    });

    expect(screen.queryByText('Push-up')).toBeInTheDocument();
    expect(screen.queryByText('Pull-up')).toBeInTheDocument();
    expect(screen.queryByText('Squat')).not.toBeInTheDocument();
  });
});
