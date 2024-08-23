import reducer, {
  addExercise,
  deleteExercise,
  restoreExercises,
  setExercises,
  updateExercise,
} from '@/features/exercises/exercises-slice';
import { db } from '@/db';
import { v4 } from 'uuid';
import { generateExercise } from '@/lib/test-utils';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

describe('exercises slice', () => {
  const id = '16281fc7-56d7-4cba-b5c0-d3c3856ca604';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('add exercise', () => {
    it('should add a new exercise to the state', () => {
      const initialState = {
        values: [],
      };

      const newExercise = {
        name: 'Squats',
        description: 'Squats description',
      };

      vi.mocked(v4).mockImplementation(() => id);

      const action = addExercise(newExercise);
      const nextState = reducer(initialState, action);

      expect(nextState.values).toHaveLength(1);
      expect(nextState.values[0]).toEqual(
        generateExercise({
          id,
          position: 0,
          ...newExercise,
        }),
      );

      expect(db.exercises.add).toHaveBeenCalledWith(
        generateExercise({
          id,
          position: 0,
          ...newExercise,
        }),
      );
    });
  });

  describe('delete exercise', () => {
    it('should delete an exercise from the state', () => {
      const initialState = {
        values: [
          generateExercise({
            id,
            name: 'Squats',
          }),
        ],
      };

      const action = deleteExercise(id);
      const nextState = reducer(initialState, action);

      expect(nextState.values).toHaveLength(0);
      expect(db.exercises.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('update exercise', () => {
    it('should update an exercise in the state', () => {
      const initialState = {
        values: [
          generateExercise({
            id,
            name: 'Squats',
          }),
        ],
      };

      const updatedExercise = generateExercise({
        id,
        name: 'Push ups',
      });

      const action = updateExercise(updatedExercise);
      const nextState = reducer(initialState, action);

      expect(nextState.values).toHaveLength(1);
      expect(nextState.values[0]).toEqual(updatedExercise);

      expect(db.exercises.update).toHaveBeenCalledWith(id, updatedExercise);
    });
  });

  describe('set exercises', () => {
    it('should set the exercises in the state', () => {
      const initialState = {
        values: [],
      };

      const exercises = [
        generateExercise({
          id: '1',
          position: 1,
          name: 'Squats',
        }),
        generateExercise({
          id: '2',
          position: 0,
          name: 'Push ups',
        }),
      ];

      const action = setExercises(exercises);

      const nextState = reducer(initialState, action);

      expect(nextState.values).toEqual(
        exercises.map((exercise, idx) => ({ ...exercise, position: idx })),
      );

      expect(db.exercises.bulkPut).toHaveBeenCalledWith(
        exercises.map((exercise, idx) => ({ ...exercise, position: idx })),
      );
    });
  });

  describe('restore exercises', () => {
    it('should restore the exercises in the state', () => {
      const initialState = {
        values: [],
      };

      const exercises = [
        generateExercise({
          id: '1',
          position: 1,
          name: 'Squats',
        }),
        generateExercise({
          id: '2',
          position: 0,
          name: 'Push ups',
        }),
      ];

      const action = restoreExercises(exercises);

      const nextState = reducer(initialState, action);

      expect(nextState.values).toEqual([exercises[1], exercises[0]]);
    });
  });
});
