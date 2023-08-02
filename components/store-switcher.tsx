"use client"

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Store } from '@prisma/client';
import { useStoreModal } from '@/hooks/use-store-modal';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({
  className,
  items = [],
} : StoreSwitcherProps )  {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();
  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const currentStore = formattedItems.find((item) => item.value === params.storeId);
  const [selectedStore, setSelectedStore] = useState(false);
  const onStoreSelect = (store: { label: string; value: string }) => {
    setSelectedStore(false);
    router.push(`/${store.value}`);
  };
  const gradientBorder = `linear-gradient(45deg, blue 0%, blue 50%, blue 100%)`;
  return (
  <Popover open={selectedStore} onOpenChange={setSelectedStore}>
    <PopoverTrigger>
      <Button variant= "outline" size="sm" role="combobox" aria-expanded={selectedStore} aria-label="Select a store"
      className={cn("w-[200px] shadow-lg border-solid border-2", className)} style={{
        borderImage: gradientBorder, borderImageSlice: 1, borderRadius: '10px',}}>
        <StoreIcon className="mr-5 h-5 w-5 opacity-85 text-violet-700"/>
        <span className="text-md text-violet-500 font-bold">{currentStore?.label}</span>
        <ChevronsUpDown className="ml-auto h-5 w-5 shrink-0 opacity-75 text-violet-900"/>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-1">
      <Command>
        <CommandList>
          <CommandInput placeholder="Search for a Store"/>
          <CommandEmpty>
            No Store Found 🤷‍♂️🤦‍♀️
          </CommandEmpty>
          <CommandGroup heading="List of Your Stores">
            {formattedItems.map((store) => (
              <CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className="text-sm">
                <StoreIcon className="mr-2 h-4 w-4"/>
                <span className="font-bold text-md">{store.label}</span>
                <Check className={cn("ml-auto h-4 w-4", currentStore?.value === store.value ? "opacity-100 text-sky-500" : "opacity-0" )} />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <CommandSeparator/>
        <CommandList>
          <CommandGroup>
            <CommandItem onSelect={() => {
              storeModal.onOpen();
              setSelectedStore(false);
            }}>
              <PlusCircle className="mr-2 h-5 w-5 text-emerald-500"/>
              <span className="font-bold text-emerald-500">Create a new store</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
  )
}
