import { generateWorkout } from '@/lib/test-utils';
import {
  createExerciseForWorkout,
  createWorkoutFromForm,
  updateWorkoutPositions,
  updateWorkoutUsageOfExercises,
  findExercisesByWorkoutId,
  deduplicateExercisesId,
  canStartWorkout,
} from './workout.domain';
import {
  WorkoutFormValues,
  WorkoutValue,
  WorkoutExerciseValue,
} from '@/app/core/workouts/workouts-schema';

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid'),
}));

describe('workout.domain', () => {
  describe('createExerciseForWorkout', () => {
    it('should create a new exercise with default values', () => {
      const exercise = createExerciseForWorkout();
      expect(exercise).toEqual({ id: 'mock-uuid', sets: 1, exerciseId: '' });
    });
  });

  describe('createWorkoutFromForm', () => {
    it('should create a new workout from form values', () => {
      const values: WorkoutFormValues = { name: 'Test Workout', exercises: [] };
      const workout = createWorkoutFromForm(values, 1);
      expect(workout).toEqual({
        id: 'mock-uuid',
        position: 1,
        name: 'Test Workout',
        exercises: [],
      });
    });
  });

  describe('updateWorkoutPositions', () => {
    it('should update the positions of workouts', () => {
      const workouts: WorkoutValue[] = [
        { id: '1', position: 1, name: 'Workout 1', exercises: [] },
        { id: '2', position: 0, name: 'Workout 2', exercises: [] },
      ];

      const updatedWorkouts = updateWorkoutPositions(workouts);

      expect(updatedWorkouts).toEqual([
        { id: '1', position: 0, name: 'Workout 1', exercises: [] },
        { id: '2', position: 1, name: 'Workout 2', exercises: [] },
      ]);
    });
  });

  describe('updateWorkoutUsageOfExercises', () => {
    it('should identify added and removed exercises', () => {
      const existingWorkouts: WorkoutValue[] = [
        {
          id: '1',
          position: 0,
          name: 'Workout 1',
          exercises: [
            { exerciseId: 'e1', sets: 1, id: '1' },
            { exerciseId: 'e2', sets: 1, id: '2' },
          ],
        },
        {
          id: '2',
          position: 1,
          name: 'Workout 2',
          exercises: [],
        },
      ];

      const updatedWorkout: WorkoutValue = {
        id: '1',
        position: 0,
        name: 'Workout 1',
        exercises: [
          { exerciseId: 'e2', sets: 1, id: '2' },
          { exerciseId: 'e3', sets: 1, id: '3' },
        ],
      };

      const result = updateWorkoutUsageOfExercises(
        existingWorkouts,
        updatedWorkout,
      );
      expect(result).toEqual({
        addedExercises: [{ exerciseId: 'e3', sets: 1, id: '3' }],
        removedExercises: [{ exerciseId: 'e1', sets: 1, id: '1' }],
      });
    });
  });

  describe('findExercisesByWorkoutId', () => {
    it('should find exercises by workout ID', () => {
      const workouts: WorkoutValue[] = [
        {
          id: '1',
          position: 0,
          name: 'Workout 1',
          exercises: [{ exerciseId: 'e1', sets: 1, id: '1' }],
        },
      ];

      const result = findExercisesByWorkoutId(workouts, '1');

      expect(result).toEqual([{ exerciseId: 'e1', sets: 1, id: '1' }]);
    });

    it('should return an empty array if workout ID is not found', () => {
      const workouts: WorkoutValue[] = [
        {
          id: '1',
          position: 0,
          name: 'Workout 1',
          exercises: [{ exerciseId: 'e1', sets: 1, id: '1' }],
        },
      ];

      const result = findExercisesByWorkoutId(workouts, '2');

      expect(result).toEqual([]);
    });
  });

  describe('deduplicateExercises', () => {
    it('should deduplicate exercises', () => {
      const exercises: WorkoutExerciseValue[] = [
        { exerciseId: 'e1', sets: 1, id: '1' },
        { exerciseId: 'e1', sets: 1, id: '2' },
        { exerciseId: 'e2', sets: 1, id: '3' },
      ];

      const result = deduplicateExercisesId(exercises);

      expect(result).toEqual(new Set(['e1', 'e2']));
    });
  });

  describe('canStartWorkout', () => {
    it('should return true if workout can be started', () => {
      const workout: WorkoutValue = generateWorkout({
        exercises: [{ exerciseId: 'e1', sets: 1, id: '1' }],
      });

      const result = canStartWorkout(workout);

      expect(result).toBe(true);
    });

    it('should return false if workout cannot be started', () => {
      const workout: WorkoutValue = generateWorkout({});

      const result = canStartWorkout(workout);

      expect(result).toBe(false);
    });
  });
});
