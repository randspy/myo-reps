import { ExerciseDbService } from './exercise-db-service';
import { db } from '@/db';
import { generateExercise } from '@/lib/test-utils';
import { vi, describe, beforeEach, test, expect } from 'vitest';

describe('ExerciseDbService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('bulkPut should call db.exercises.bulkPut with the provided exercises', async () => {
    const exercises = [generateExercise(), generateExercise()];
    await ExerciseDbService.bulkPut(exercises);
    expect(db.exercises.bulkPut).toHaveBeenCalledWith(exercises);
  });

  test('add should call db.exercises.add with the provided exercise', async () => {
    const exercise = generateExercise();
    await ExerciseDbService.add(exercise);
    expect(db.exercises.add).toHaveBeenCalledWith(exercise);
  });

  test('delete should call db.exercises.delete with the provided id', async () => {
    const id = '123';
    await ExerciseDbService.delete(id);
    expect(db.exercises.delete).toHaveBeenCalledWith(id);
  });

  test('update should call db.exercises.update with the provided exercise', async () => {
    const exercise = generateExercise();
    await ExerciseDbService.update(exercise);
    expect(db.exercises.update).toHaveBeenCalledWith(exercise.id, exercise);
  });
});
