import { useRef } from 'react';
import { useBlocker } from 'react-router-dom';
import { UnsavedFormChangesDialog } from '@/app/ui/UnsavedFormChangesDialog';

export type OnDirtyChange = (value: boolean) => void;
export type OnSubmit = () => void;
export type ChildrenFunction = (
  onDirtyChange: OnDirtyChange,
  onSubmit: OnSubmit,
) => JSX.Element;

export const UnsavedFormChangesBlocker: React.FC<{
  children: ChildrenFunction;
}> = ({ children: children }) => {
  const isDirty = useRef(false);
  const isFormSubmitted = useRef(false);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return (
      isDirty.current &&
      !isFormSubmitted.current &&
      currentLocation.pathname !== nextLocation.pathname
    );
  });

  function onDirtyChange(value: boolean) {
    isDirty.current = value;
  }

  function onSubmit() {
    isFormSubmitted.current = true;
  }
  return (
    <>
      {children(onDirtyChange, onSubmit)}
      {blocker && (
        <UnsavedFormChangesDialog
          open={blocker.state === 'blocked'}
          cancel={() => {
            blocker.reset!();
          }}
          ok={() => {
            blocker.proceed!();
          }}
        />
      )}
    </>
  );
};
