import { Button } from '@/components/ui/button';
import { NumberScrollWheelSelector } from '@/app/ui/NumberScrollWheelSelector';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { useClickAway } from '@uidotdev/usehooks';

export const NumberScrollWheelSelectorPopover: React.FC<{
  value: number;
  label: string;
  max: number;
  onValueChange: (value: number) => void;
}> = ({ value, label, max, onValueChange }) => {
  const [open, setOpen] = useState(false);

  const handleClickAway = () => {
    setOpen(false);
  };

  const ref = useClickAway<HTMLDivElement>(handleClickAway);

  return (
    <Popover modal={true} open={open}>
      <PopoverTrigger asChild>
        <Button onClick={() => setOpen(true)} className="min-w-12 text-center">
          {value}
        </Button>
      </PopoverTrigger>

      <PopoverContent ref={ref} className="w-30 p-0">
        <div className="m-2 text-center">{label}</div>
        <NumberScrollWheelSelector
          value={value}
          max={max}
          onValueChange={(newValue) => {
            onValueChange(newValue);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
