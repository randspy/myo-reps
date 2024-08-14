import reducer, { addExercise } from '@/features/exercises/exercises-slice';

type UUID = `${string}-${string}-${string}-${string}-${string}`;

describe('exercises slice', () => {
  let originalRandomUUID: () => UUID;
  const id = '16281fc7-56d7-4cba-b5c0-d3c3856ca604';

  beforeAll(() => {
    originalRandomUUID = crypto.randomUUID;
  });

  beforeEach(() => {
    vi.spyOn(global.crypto, 'randomUUID').mockReturnValue(id);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    global.crypto.randomUUID = originalRandomUUID;
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

      const action = addExercise(newExercise);
      const nextState = reducer(initialState, action);

      expect(nextState.values).toHaveLength(1);
      expect(nextState.values[0]).toEqual({
        id,
        ...newExercise,
      });
    });
  });
});
