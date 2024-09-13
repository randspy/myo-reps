import { Reorder } from 'framer-motion';

interface DragAndDropListProps<V> {
  children: React.ReactNode;
  values: V[];
  onReorder: (values: V[]) => void;
}

export const DragAndDropList = <V,>({
  children,
  values,
  onReorder,
}: DragAndDropListProps<V>) => {
  return (
    <Reorder.Group
      className="flex flex-col items-center"
      values={values}
      onReorder={onReorder}
    >
      {children}
    </Reorder.Group>
  );
};
