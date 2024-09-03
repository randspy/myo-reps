import { useRef } from 'react';
import { useBlocker } from 'react-router-dom';
import { UnsavedFormChangesDialog } from '@/app/ui/UnsavedFormChangesDialog';

export type OnDirtyChange = (value: boolean) => void;
export type OnSubmit = () => void;
export type RenderFunction = (
  onDirtyChange: OnDirtyChange,
  onSubmit: OnSubmit,
) => JSX.Element;

export const UnsavedFormChangesBlocker: React.FC<{
  render: RenderFunction;
}> = ({ render }) => {
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
      {render(onDirtyChange, onSubmit)}
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
