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
import { ExerciseValue } from '@/app/core/exercises/exercises-types';
import { WorkoutExerciseValue } from '@/app/core/workouts/workouts-types';
import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { defaultWorkoutExerciseFormValue } from '@/app/core/workouts/domain/workouts-config';

export const ExerciseComboBox: React.FC<{
  items: ExerciseValue[];
  dropdownItems: ExerciseValue[];
  selected: WorkoutExerciseValue | undefined;
  onSelect: (item: WorkoutExerciseValue) => void;
}> = ({
  items,
  dropdownItems,
  selected = defaultWorkoutExerciseFormValue,
  onSelect,
}) => {
  const [open, setOpen] = React.useState(false);

  const fuzzySearch = useMemo(
    () => new Fuse(dropdownItems, { keys: ['name'], includeScore: true }),
    [dropdownItems],
  );

  const filterItems = (id: string, searchPrompt: string) => {
    // it's not optimal to have a search for every item, duplicated work
    // there is a mismatch between the fuzzy search libraries and the api provided
    // by the Command component. Command component should provide a way to filter
    // items in one function execution for all items.
    // Neverless, it's good enough for number of items I will work with

    const matchedItems = fuzzySearch
      .search(searchPrompt)
      .filter((match) => match.item.id === id);

    return matchedItems.length && matchedItems[0].score
      ? 1 - matchedItems[0].score
      : 0;
  };

  const itemSelected = (id: string) => {
    if (id !== selected.id) {
      onSelect({
        ...selected,
        exerciseId: id,
      });
    }

    setOpen(false);
  };

  const selectedName = () => {
    if (selected.exerciseId) {
      return items.find((item) => item.id === selected.exerciseId)?.name;
    }

    return 'Select Exercise';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate"
        >
          {selectedName()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command filter={filterItems}>
          <CommandInput placeholder="Search Exercise" />
          <CommandList>
            <CommandEmpty>No exercise found.</CommandEmpty>
            <CommandGroup>
              {dropdownItems.map((item) => (
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
