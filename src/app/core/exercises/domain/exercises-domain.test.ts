import {
  ExerciseFormValues,
  ExerciseValue,
} from '@/app/core/exercises/exercises-types';
import {
  createExerciseFromForm,
  updateExercisePositions,
  removeExerciseFromUserView,
  addUsageToExercise,
  removeUsageFromExercise,
} from './exercises-domain';

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid'),
}));

describe('exercises-domain', () => {
  describe('createExerciseFromForm', () => {
    test('should create an exercise with the given form values and position', () => {
      const values: ExerciseFormValues = {
        name: 'Squat',
        description: 'Leg exercise',
      };
      const position = 1;
      const exercise = createExerciseFromForm(values, position);

      expect(exercise).toMatchObject({
        ...values,
        position,
        usage: [],
        hidden: false,
        id: 'mock-uuid',
      });
    });
  });

  describe('updateExercisePositions', () => {
    test('should update the positions of the exercises', () => {
      const exercises: ExerciseValue[] = [
        {
          id: '1',
          name: 'Squat',
          description: 'Leg exercise',
          position: 1,
          usage: [],
          hidden: false,
        },
        {
          id: '2',
          name: 'Bench Press',
          description: 'Chest exercise',
          position: 0,
          usage: [],
          hidden: false,
        },
      ];
      const updatedExercises = updateExercisePositions(exercises);

      expect(updatedExercises[0].position).toBe(0);
      expect(updatedExercises[1].position).toBe(1);
    });
  });

  describe('removeExerciseFromUserView', () => {
    test('should return null if the exercise is not found', () => {
      const exercises: ExerciseValue[] = [];
      const action = removeExerciseFromUserView('1', exercises);

      expect(action).toBeNull();
    });

    test('should return update action if the exercise has usage', () => {
      const exercises: ExerciseValue[] = [
        {
          id: '1',
          name: 'Squat',
          description: 'Leg exercise',
          position: 0,
          usage: [{ id: 'user1' }],
          hidden: false,
        },
      ];
      const action = removeExerciseFromUserView('1', exercises);

      expect(action).toEqual({
        type: 'update',
        payload: { ...exercises[0], hidden: true },
      });
    });

    test('should return delete action if the exercise has no usage', () => {
      const exercises: ExerciseValue[] = [
        {
          id: '1',
          name: 'Squat',
          description: 'Leg exercise',
          position: 0,
          usage: [],
          hidden: false,
        },
      ];
      const action = removeExerciseFromUserView('1', exercises);

      expect(action).toEqual({ type: 'delete', payload: '1' });
    });
  });

  describe('addUsageToExercise', () => {
    test('should add usage to the exercise', () => {
      const exercises: ExerciseValue[] = [
        {
          id: '1',
          name: 'Squat',
          description: 'Leg exercise',
          position: 0,
          usage: [],
          hidden: false,
        },
      ];
      const exercise = addUsageToExercise(exercises, '1', 'user1');

      expect(exercise?.usage).toEqual([{ id: 'user1' }]);
    });
  });

  describe('removeUsageFromExercise', () => {
    test('should return null if the exercise is not found', () => {
      const exercises: ExerciseValue[] = [];
      const action = removeUsageFromExercise(exercises, '1', 'user1');

      expect(action).toBeNull();
    });

    test('should return delete action if the exercise has no usage and is hidden', () => {
      const exercises: ExerciseValue[] = [
        {
          id: '1',
          name: 'Squat',
          description: 'Leg exercise',
          position: 0,
          usage: [{ id: 'user1' }],
          hidden: true,
        },
      ];
      const action = removeUsageFromExercise(exercises, '1', 'user1');

      expect(action).toEqual({ type: 'delete', payload: '1' });
    });

    test('should return update action if the exercise still has usage', () => {
      const exercises: ExerciseValue[] = [
        {
          id: '1',
          name: 'Squat',
          description: 'Leg exercise',
          position: 0,
          usage: [{ id: 'user1' }, { id: 'user2' }],
          hidden: true,
        },
      ];
      const action = removeUsageFromExercise(exercises, '1', 'user1');

      expect(action).toEqual({
        type: 'update',
        payload: {
          ...exercises[0],
          usage: [{ id: 'user2' }],
        },
      });
    });
  });
});
