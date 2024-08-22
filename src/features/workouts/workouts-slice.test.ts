import reducer, {
  addWorkout,
  deleteWorkout,
  restoreWorkouts,
  setWorkouts,
  updateWorkout,
} from '@/features/workouts/workouts-slice';
import { db } from '@/db';
import { v4 } from 'uuid';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

describe('workout slice', () => {
  const id = '16281fc7-56d7-4cba-b5c0-d3c3856ca604';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('add workout', () => {
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
        position: 0,
        ...newWorkout,
      });

      expect(db.workouts.add).toHaveBeenCalledWith({
        id,
        position: 0,
        ...newWorkout,
      });
    });
  });

  describe('delete workout', () => {
    it('should delete an workout from the state', () => {
      const initialState = {
        values: [
          {
            id,
            position: 0,
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

  describe('update workout', () => {
    it('should update an workout in the state', () => {
      const initialState = {
        values: [
          {
            id,
            position: 0,
            name: 'Squats',
            description: 'Squats description',
          },
        ],
      };

      const updatedWorkout = {
        id,
        position: 0,
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

  describe('set workouts', () => {
    it('should set the workouts in the state', () => {
      const initialState = {
        values: [],
      };

      const workouts = [
        {
          id: '1',
          name: 'Squats',
          position: 1,
          description: 'Squats description',
        },
        {
          id: '2',
          name: 'Push ups',
          position: 0,
          description: 'Push ups description',
        },
      ];

      const action = setWorkouts(workouts);

      const nextState = reducer(initialState, action);

      expect(nextState.values).toEqual(
        workouts.map((workout, idx) => ({ ...workout, position: idx })),
      );

      expect(db.workouts.bulkPut).toHaveBeenCalledWith(
        workouts.map((workout, idx) => ({ ...workout, position: idx })),
      );
    });
  });

  describe('restore workouts', () => {
    it('should set the restore in the state', () => {
      const initialState = {
        values: [],
      };

      const workouts = [
        {
          id: '1',
          position: 1,
          name: 'Squats',
          description: 'Squats description',
        },
        {
          id: '2',
          position: 0,
          name: 'Push ups',
          description: 'Push ups description',
        },
      ];

      const action = restoreWorkouts(workouts);

      const nextState = reducer(initialState, action);

      expect(nextState.values).toEqual([workouts[1], workouts[0]]);
    });
  });
});
