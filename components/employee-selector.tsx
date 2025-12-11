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
import { Employee } from '@/types/employee';
import { useEmployees } from '@/features/employees/hooks/use-employees';
import { Badge } from '@/components/ui/badge';

interface EmployeeSelectorProps {
  value?: number; // employee key
  onSelect: (employee: Employee | null) => void;
  disabled?: boolean;
}

export function EmployeeSelector({
  value,
  onSelect,
  disabled,
}: EmployeeSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { data: employees = [], isLoading } = useEmployees();

  const selectedEmployee = value 
    ? employees.find(emp => emp.key === value)
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || isLoading}
        >
          {selectedEmployee ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="truncate">
                {selectedEmployee.firstname} {selectedEmployee.name}
              </span>
              <Badge variant="outline" className="text-xs">
                {selectedEmployee.key}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {isLoading ? 'Lädt...' : 'Mitarbeiter auswählen...'}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Mitarbeiter suchen..." />
          <CommandList>
            <CommandEmpty>Keine Mitarbeiter gefunden.</CommandEmpty>
            <CommandGroup>
              {employees.map((employee) => (
                <CommandItem
                  key={employee.key}
                  value={`${employee.firstname} ${employee.name} ${employee.key}`}
                  onSelect={() => {
                    onSelect(value === employee.key ? null : employee);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === employee.key ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex items-center justify-between flex-1 gap-2">
                    <span className="flex-1 truncate">
                      {employee.firstname} {employee.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {employee.key}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {employee.type}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
