import { WorkoutDbService } from './workout-db-service';
import { db } from '@/db';
import { generateWorkout } from '@/lib/test-utils';
import { vi, describe, beforeEach, test, expect } from 'vitest';

vi.mock('@/db', () => ({
  db: {
    workouts: {
      bulkPut: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('WorkoutService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('bulkPut should call db.workouts.bulkPut with the provided workouts', async () => {
    const workouts = [generateWorkout(), generateWorkout()];
    await WorkoutDbService.bulkPut(workouts);
    expect(db.workouts.bulkPut).toHaveBeenCalledWith(workouts);
  });

  test('add should call db.workouts.add with the provided workout', async () => {
    const workout = generateWorkout();
    await WorkoutDbService.add(workout);
    expect(db.workouts.add).toHaveBeenCalledWith(workout);
  });

  test('delete should call db.workouts.delete with the provided id', async () => {
    const id = '123';
    await WorkoutDbService.delete(id);
    expect(db.workouts.delete).toHaveBeenCalledWith(id);
  });

  test('update should call db.workouts.update with the provided workout', async () => {
    const workout = generateWorkout();
    await WorkoutDbService.update(workout);
    expect(db.workouts.update).toHaveBeenCalledWith(workout.id, workout);
  });
});
