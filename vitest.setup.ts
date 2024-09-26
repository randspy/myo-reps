import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('@/db', () => ({
  db: {
    exercises: {
      add: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
      bulkPut: vi.fn(),
    },
    workouts: {
      add: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
      bulkPut: vi.fn(),
    },
    sessions: {
      add: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
      bulkPut: vi.fn(),
    },
  },
  recreateDB: vi.fn(),
}));
