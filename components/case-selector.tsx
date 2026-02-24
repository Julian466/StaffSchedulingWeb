'use client';

import { useCase } from '@/components/case-provider';
import { useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { parseMonthYear } from '@/lib/utils/case-utils';

const MONTHS = [
  { value: 1, label: 'Januar' },
  { value: 2, label: 'Februar' },
  { value: 3, label: 'März' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Dezember' },
];

const createCaseSchema = z.object({
  unitId: z.number().min(1, 'Planungseinheit muss mindestens 1 sein'),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
});

type CreateCaseFormValues = z.infer<typeof createCaseSchema>;

export function CaseSelector() {
  const { currentCase, availableCases, switchCase, createNewCase, isLoading } = useCase();
  const router = useRouter();
  const pathname = usePathname();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const form = useForm<CreateCaseFormValues>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      unitId: 1,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  // Build a flat list of all case options for the selector
  const allCaseOptions = availableCases.flatMap(unit =>
    unit.months.map(monthYear => ({
      unitId: unit.unitId,
      monthYear,
      ...parseMonthYear(monthYear)
    }))
  );

  const getMonthName = (month: number) => {
    const monthData = MONTHS.find(m => m.value === month);
    return monthData?.label || '';
  };

  const handleCaseChange = async (value: string) => {
    const [unitIdStr, monthYear] = value.split('|');
    const unitId = parseInt(unitIdStr);
    await switchCase(unitId, monthYear);

    // Navigate with search params, preserving current path
    const searchStr = `?caseId=${unitId}&monthYear=${monthYear}`;
    const currentPath = pathname === '/' ? '/employees' : pathname;
    router.push(`${currentPath}${searchStr}`);
  };

  const handleCreateCase = async (data: CreateCaseFormValues) => {
    try {
      await createNewCase(data.unitId, data.month, data.year);
      setShowCreateDialog(false);
      form.reset();
      const monthYear = `${data.month}_${data.year}`;
      router.push(`/employees?caseId=${data.unitId}&monthYear=${monthYear}`);
    } catch (error) {
      console.error('Failed to create case:', error);
    }
  };

  const currentValue = currentCase 
    ? `${currentCase.caseId}|${currentCase.monthYear}` 
    : '';

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Case:</span>
        <Select
          value={currentValue}
          onValueChange={handleCaseChange}
          disabled={isLoading || !currentCase}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Wähle Case" />
          </SelectTrigger>
          <SelectContent>
            {allCaseOptions.map((option) => (
              <SelectItem 
                key={`${option.unitId}|${option.monthYear}`} 
                value={`${option.unitId}|${option.monthYear}`}
              >
                Case {option.unitId} - {getMonthName(option.month)} {option.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowCreateDialog(true)}
          disabled={isLoading}
          title="Neuen Case erstellen"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuen Case erstellen</DialogTitle>
            <DialogDescription>
              Erstelle einen neuen Case mit Planungseinheit, Monat und Jahr.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateCase)} className="space-y-4">
              <FormField
                control={form.control}
                name="unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planungseinheit ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monat</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wähle einen Monat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jahr</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Abbrechen
                </Button>
                <Button type="submit">
                  Erstellen
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
