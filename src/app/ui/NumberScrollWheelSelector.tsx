import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';

export const NumberScrollWheelSelector: React.FC<{
  value: number;
  max: number;
  onValueChange: (value: number) => void;
}> = ({ value, max, onValueChange }) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [maxWidth, setMaxWidth] = useState(0);

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

  useEffect(() => {
    const widths = refs.current.map((el) => el?.offsetWidth || 0);
    setMaxWidth(Math.max(...widths));
  }, [numbersInRange]);

  return (
    <ScrollArea className="h-40 w-full rounded-md">
      <div className="flex flex-col items-center p-4 pt-0">
        {numbersInRange.map((number, index) => (
          <Button
            variant={value === number ? 'default' : 'outline'}
            key={number}
            className="my-1 text-sm"
            onClick={() => onValueChange(number)}
            ref={(el) => (refs.current[index] = el)}
            // all buttons should have the same width, the width of the widest button,
            // we need auto width for the button to take the width of the content
            style={{ width: maxWidth ? `${maxWidth}px` : 'auto' }}
          >
            {number}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
