import reducer, {
  addExercise,
  deleteExercise,
  updateExercise,
} from '@/features/exercises/exercises-slice';
import { db } from '@/db';
import { v4 } from 'uuid';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    exercises: {
      add: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('exercises slice', () => {
  const id = '16281fc7-56d7-4cba-b5c0-d3c3856ca604';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addExercise', () => {
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
      expect(nextState.values[0]).toEqual({
        id,
        ...newExercise,
      });

      expect(db.exercises.add).toHaveBeenCalledWith({
        id,
        ...newExercise,
      });
    });
  });

  describe('deleteExercise', () => {
    it('should delete an exercise from the state', () => {
      const initialState = {
        values: [
          {
            id,
            name: 'Squats',
            description: 'Squats description',
          },
        ],
      };

      const action = deleteExercise(id);
      const nextState = reducer(initialState, action);

      expect(nextState.values).toHaveLength(0);
      expect(db.exercises.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('updateExercise', () => {
    it('should update an exercise in the state', () => {
      const initialState = {
        values: [
          {
            id,
            name: 'Squats',
            description: 'Squats description',
          },
        ],
      };

      const updatedExercise = {
        id,
        name: 'Push ups',
        description: 'Push ups description',
      };

      const action = updateExercise(updatedExercise);
      const nextState = reducer(initialState, action);

      expect(nextState.values).toHaveLength(1);
      expect(nextState.values[0]).toEqual(updatedExercise);

      expect(db.exercises.update).toHaveBeenCalledWith(id, updatedExercise);
    });
  });

  describe('setExercises', () => {
    it('should set the exercises in the state', () => {
      const initialState = {
        values: [],
      };

      const exercises = [
        {
          id: '1',
          name: 'Squats',
          description: 'Squats description',
        },
        {
          id: '2',
          name: 'Push ups',
          description: 'Push ups description',
        },
      ];

      const action = {
        type: 'exercises/setExercises',
        payload: exercises,
      };

      const nextState = reducer(initialState, action);

      expect(nextState.values).toEqual(exercises);
    });
  });
});
