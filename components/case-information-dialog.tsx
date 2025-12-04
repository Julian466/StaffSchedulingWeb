'use client';

import { useCase } from '@/components/case-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

const caseInfoSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
});

type CaseInfoFormValues = z.infer<typeof caseInfoSchema>;

interface CaseInformationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function CaseInformationDialog({ open, onOpenChange }: CaseInformationDialogProps) {
  const { caseInformation, updateCaseInformation } = useCase();

  const form = useForm<CaseInfoFormValues>({
    resolver: zodResolver(caseInfoSchema),
    defaultValues: {
      month: caseInformation?.month || new Date().getMonth() + 1,
      year: caseInformation?.year || new Date().getFullYear(),
    },
  });

  useEffect(() => {
    if (caseInformation && open) {
      form.reset({
        month: caseInformation.month,
        year: caseInformation.year,
      });
    }
  }, [caseInformation, open, form]);

  const onSubmit = async (data: CaseInfoFormValues) => {
    try {
      await updateCaseInformation(data.month, data.year);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update case information:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Case Information</DialogTitle>
          <DialogDescription>
            Lege fest, für welchen Monat und Jahr dieser Datensatz gilt.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Abbrechen
              </Button>
              <Button type="submit">Speichern</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
