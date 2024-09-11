import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useRef } from 'react';

export const NumberScrollWheelSelector: React.FC<{
  value: number;
  max: number;
  onValueChange: (value: number) => void;
}> = ({ value, max, onValueChange }) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const numbersInRange = useMemo(() => {
    return Array.from({ length: max }).map((_, i) => i + 1);
  }, [max]);

  useEffect(() => {
    const scrollToNumber = (number: number) => {
      const element = refs.current[number - 1];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    scrollToNumber(value);
  }, []);

  return (
    <ScrollArea className="h-40 w-full rounded-md">
      <div className="flex flex-col items-center p-4 pt-0">
        {numbersInRange.map((number, index) => (
          <Button
            variant={value === number ? 'default' : 'outline'}
            key={number}
            className="my-1 min-w-12 text-sm"
            onClick={() => onValueChange(number)}
            ref={(el) => (refs.current[index] = el)}
          >
            {number}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
