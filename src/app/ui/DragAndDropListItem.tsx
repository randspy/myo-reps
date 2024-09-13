import { Reorder } from 'framer-motion';

interface DragAndDropListItemProps<V> {
  children: React.ReactNode;
  value: V;
}

export const DragAndDropListItem = <V,>({
  children,
  value,
}: DragAndDropListItemProps<V>) => {
  return (
    <Reorder.Item
      value={value}
      className="my-1 flex w-full cursor-grab items-center bg-background-secondary p-5 pr-2 shadow-sm focus-within:shadow-md hover:shadow-md md:w-128"
    >
      {children}
    </Reorder.Item>
  );
};
