import { act, renderHook } from '@testing-library/react';
import { usePersistForm } from '@/app/core/hooks/usePersistentForm';
import { Mock, vi } from 'vitest';
import { UseFormWatch } from 'react-hook-form';

interface TestFormValues {
  name: string;
  description?: string;
}

describe('Use persist form', () => {
  const storageKey = 'test-form';
  const mockSetValue = vi.fn();
  let callbackMock: (values: TestFormValues) => void;

  const mockWatch = vi.fn((callback: (values: TestFormValues) => void) => {
    callbackMock = callback;
    return {
      unsubscribe: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any as UseFormWatch<TestFormValues>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should retrieve values from localStorage and set them in the form', () => {
    const mockTimestamp = Date.now() - 5000; // within the valid time frame
    const mockStorageData = {
      name: 'stored name',
      description: 'stored description',
      _timestamp: mockTimestamp,
    };
    localStorage.setItem(storageKey, JSON.stringify(mockStorageData));

    renderHook(() =>
      usePersistForm<TestFormValues>(storageKey, {
        watch: mockWatch,
        setValue: mockSetValue,
      }),
    );

    expect(mockSetValue).toHaveBeenCalledWith('name', 'stored name');
    expect(mockSetValue).toHaveBeenCalledWith(
      'description',
      'stored description',
    );
  });

  it('should remove localStorage item if the stored timestamp is older than one hour', () => {
    const oldTimestamp = Date.now() - 2 * 60 * 60 * 1000;
    const mockStorageData = {
      name: 'old name',
      description: 'old description',
      _timestamp: oldTimestamp,
    };
    localStorage.setItem(storageKey, JSON.stringify(mockStorageData));

    renderHook(() =>
      usePersistForm<TestFormValues>(storageKey, {
        watch: mockWatch,
        setValue: mockSetValue,
      }),
    );

    expect(localStorage.getItem(storageKey)).toBeNull();
    expect(mockSetValue).not.toHaveBeenCalled();
  });

  it('should subscribe to form changes and store them in localStorage', () => {
    renderHook(() =>
      usePersistForm<TestFormValues>(storageKey, {
        watch: mockWatch,
        setValue: mockSetValue,
      }),
    );

    act(() => {
      callbackMock({
        name: 'test name',
        description: 'test description',
      });
    });

    const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    expect(storedData).toMatchObject({
      name: 'test name',
      description: 'test description',
    });
    expect(storedData._timestamp).toBeDefined();
  });

  it('should clear localStorage when clear function is called', () => {
    localStorage.setItem(storageKey, JSON.stringify({ name: 'test' }));

    const { result } = renderHook(() =>
      usePersistForm<TestFormValues>(storageKey, {
        watch: mockWatch,
        setValue: mockSetValue,
      }),
    );

    result.current.clear();

    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  it('should unsubscribe from watch when component unmounts', () => {
    const unsubscribeMock = vi.fn();
    (mockWatch as Mock).mockImplementation(() => ({
      unsubscribe: unsubscribeMock,
    }));

    const { unmount } = renderHook(() =>
      usePersistForm<TestFormValues>(storageKey, {
        watch: mockWatch,
        setValue: mockSetValue,
      }),
    );

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
