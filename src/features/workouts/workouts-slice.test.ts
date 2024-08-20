import reducer, {
  addWorkout,
  deleteWorkout,
  setWorkouts,
  updateWorkout,
} from '@/features/workouts/workouts-slice';
import { db } from '@/db';
import { v4 } from 'uuid';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    workouts: {
      add: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('workout slice', () => {
  const id = '16281fc7-56d7-4cba-b5c0-d3c3856ca604';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addWorkout', () => {
    it('should add a new workout to the state', () => {
      const initialState = {
        values: [],
      };

      const newWorkout = {
        name: 'Squats',
        description: 'Squats description',
      };

      vi.mocked(v4).mockImplementation(() => id);

      const action = addWorkout(newWorkout);
      const nextState = reducer(initialState, action);

      expect(nextState.values).toHaveLength(1);
      expect(nextState.values[0]).toEqual({
        id,
        ...newWorkout,
      });

      expect(db.workouts.add).toHaveBeenCalledWith({
        id,
        ...newWorkout,
      });
    });
  });

  describe('deleteWorkout', () => {
    it('should delete an workout from the state', () => {
      const initialState = {
        values: [
          {
            id,
            name: 'Squats',
            description: 'Squats description',
          },
        ],
      };

      const action = deleteWorkout(id);
      const nextState = reducer(initialState, action);

      expect(nextState.values).toHaveLength(0);
      expect(db.workouts.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('updateWorkout', () => {
    it('should update an workout in the state', () => {
      const initialState = {
        values: [
          {
            id,
            name: 'Squats',
            description: 'Squats description',
          },
        ],
      };

      const updatedWorkout = {
        id,
        name: 'Push ups',
        description: 'Push ups description',
      };

      const action = updateWorkout(updatedWorkout);
      const nextState = reducer(initialState, action);

      expect(nextState.values).toHaveLength(1);
      expect(nextState.values[0]).toEqual(updatedWorkout);

      expect(db.workouts.update).toHaveBeenCalledWith(id, updatedWorkout);
    });
  });

  describe('setWorkouts', () => {
    it('should set the workouts in the state', () => {
      const initialState = {
        values: [],
      };

      const workouts = [
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

      const action = setWorkouts(workouts);

      const nextState = reducer(initialState, action);

      expect(nextState.values).toEqual(workouts);
    });
  });
});
