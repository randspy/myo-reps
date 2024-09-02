import { useEffect } from 'react';
import { FieldValues, UseFormWatch } from 'react-hook-form';

export interface FormPersistConfig<
  TFieldValues extends FieldValues = FieldValues,
> {
  watch: UseFormWatch<TFieldValues>;
  setValue: (
    name: keyof TFieldValues,
    value: TFieldValues[keyof TFieldValues],
  ) => void;
}

const OneHour = 1000 * 60 * 60;

export const usePersistForm = <TFieldValues extends FieldValues = FieldValues>(
  storageKey: string,
  { watch, setValue }: FormPersistConfig<TFieldValues>,
) => {
  useEffect(() => {
    const string = window.localStorage.getItem(storageKey);

    if (string) {
      const { _timestamp = null, ...values } = JSON.parse(string);
      const currentTimestamp = Date.now();

      if (currentTimestamp - _timestamp > OneHour) {
        window.localStorage.removeItem(storageKey);
        return;
      }

      Object.keys(values).forEach((key) => {
        setValue(key, values[key]);
      });
    }
  }, [storageKey, setValue]);

  useEffect(() => {
    const subscription = watch((watchedValues) => {
      const values = { ...watchedValues };

      if (Object.entries(values).length) {
        values._timestamp = Date.now();
        window.localStorage.setItem(storageKey, JSON.stringify(values));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, storageKey]);

  return {
    clear: () => {
      return window.localStorage.removeItem(storageKey);
    },
  };
};
