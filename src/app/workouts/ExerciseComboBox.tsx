'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  defaultValues as defaultExercise,
  ExerciseValue,
} from '@/features/exercises/exercises-schema';

export const ExerciseComboBox: React.FC<{
  items: ExerciseValue[];
  selected: ExerciseValue | undefined;
  onSelect: (item: ExerciseValue) => void;
}> = ({ items, selected = { ...defaultExercise, id: '' }, onSelect }) => {
  const [open, setOpen] = React.useState(false);

  const filterItems = (id: string, searchPrompt: string) => {
    const exerciseName = items.find((item) => item.id === id)?.name ?? '';
    return exerciseName.includes(searchPrompt) ? 1 : 0;
  };

  const itemSelected = (id: string) => {
    if (id !== selected.id) {
      const item = items.find((item) => item.id === id);
      onSelect(item!);
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.name ? selected.name : 'Select Exercise'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command filter={filterItems}>
          <CommandInput placeholder="Search Exercise" />
          <CommandList>
            <CommandEmpty>No exercise found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={itemSelected}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.id === item.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
