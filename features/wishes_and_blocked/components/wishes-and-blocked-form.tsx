'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { WishesAndBlockedEmployee } from '@/types/wishes-and-blocked';
import { useState } from 'react';
import { InteractiveCalendar, DayData } from '@/components/InteractiveCalendar';
import { Calendar as CalendarIcon, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCase } from '@/components/case-provider';
import { EmployeeSelector } from '@/components/employee-selector';
import { Employee } from '@/types/employee';

const wishesAndBlockedSchema = z.object({
  employeeKey: z.number().min(1, {
    message: 'Bitte wähle einen Mitarbeiter aus.',
  }),
});

type WishesAndBlockedFormValues = z.infer<typeof wishesAndBlockedSchema>;

interface WishesAndBlockedFormProps {
  employee?: WishesAndBlockedEmployee;
  onSubmit: (data: Omit<WishesAndBlockedEmployee, 'key'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isGlobal?: boolean;
}

// Helper to convert WishesAndBlockedEmployee data to DayData format
function convertToDayData(
  year: number,
  month: number,
  wishDays: number[],
  wishShifts: [number, string][],
  blockedDays: number[],
  blockedShifts: [number, string][],
): DayData[] {
  const dayDataMap = new Map<number, DayData>();

  // Add wish days
  wishDays.forEach(day => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dayDataMap.set(day, {
      date,
      categoryId: 'wish',
      events: dayDataMap.get(day)?.events || [],
    });
  });

  // Add blocked days
  blockedDays.forEach(day => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const existing = dayDataMap.get(day);
    dayDataMap.set(day, {
      date,
      categoryId: 'blocked',
      events: existing?.events || [],
    });
  });

  // Add wish shifts as events
  wishShifts.forEach(([day, shiftCode]) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const existing = dayDataMap.get(day);
    const events = existing?.events || [];
    
    dayDataMap.set(day, {
      date,
      categoryId: existing?.categoryId,
      events: [...events, {
        id: `${date}-wish-${shiftCode}-${Date.now()}`,
        title: shiftCode,
        categoryId: 'wish-shift',
      }],
    });
  });

  // Add blocked shifts as events
  blockedShifts.forEach(([day, shiftCode]) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const existing = dayDataMap.get(day);
    const events = existing?.events || [];
    
    dayDataMap.set(day, {
      date,
      categoryId: existing?.categoryId,
      events: [...events, {
        id: `${date}-blocked-${shiftCode}-${Date.now()}`,
        title: shiftCode,
        categoryId: 'blocked-shift',
      }],
    });
  });

  return Array.from(dayDataMap.values());
}

// Helper to convert DayData back to WishesAndBlockedEmployee format
function convertFromDayData(dayData: DayData[]): {
  wishDays: number[];
  wishShifts: [number, string][];
  blockedDays: number[];
  blockedShifts: [number, string][];
} {
  const wishDays: number[] = [];
  const wishShifts: [number, string][] = [];
  const blockedDays: number[] = [];
  const blockedShifts: [number, string][] = [];

  dayData.forEach(data => {
    const day = parseInt(data.date.split('-')[2], 10);

    if (data.categoryId === 'wish') {
      wishDays.push(day);
    } else if (data.categoryId === 'blocked') {
      blockedDays.push(day);
    }

    data.events.forEach(event => {
      if (event.categoryId === 'wish-shift') {
        wishShifts.push([day, event.title]);
      } else if (event.categoryId === 'blocked-shift') {
        blockedShifts.push([day, event.title]);
      }
    });
  });

  return { wishDays, wishShifts, blockedDays, blockedShifts };
}

export function WishesAndBlockedForm({
  employee,
  onSubmit,
  onCancel,
  isSubmitting,
  isGlobal,
}: WishesAndBlockedFormProps) {
  const { caseInformation } = useCase();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(() => 
    employee ? {
      key: employee.key,
      firstname: employee.firstname,
      name: employee.name,
      type: '',
    } as Employee : null
  );
  
  const form = useForm<WishesAndBlockedFormValues>({
    resolver: zodResolver(wishesAndBlockedSchema),
    defaultValues: {
      employeeKey: employee?.key || 0,
    },
  });

  // Get year and month from case information or use current date
  const year = caseInformation?.year || new Date().getFullYear();
  const month = caseInformation?.month || new Date().getMonth() + 1;

  // State for calendar data
  const [calendarData, setCalendarData] = useState<DayData[]>(() => 
    convertToDayData(
      year,
      month,
      employee?.wish_days || [],
      employee?.wish_shifts || [],
      employee?.blocked_days || [],
      employee?.blocked_shifts || []
    )
  );

  // Categories for day types (Wunsch, Blockiert)
  const dayCategories = [
    { id: 'wish', name: 'Wunsch-Tag', color: '#bbf7d0' },
    { id: 'blocked', name: 'Blockiert', color: '#fecaca' },
  ];

  // Categories for shifts
  const eventCategories = [
    { id: 'wish-shift', name: 'Wunsch-Schicht', color: '#a7f3d0' },
    { id: 'blocked-shift', name: 'Blockierte Schicht', color: '#fca5a5' },
  ];

  const handleFormSubmit = () => {
    if (!selectedEmployee) return;
    
    const { wishDays, wishShifts, blockedDays, blockedShifts } = convertFromDayData(calendarData);
    
    onSubmit({
      firstname: selectedEmployee.firstname,
      name: selectedEmployee.name,
      wish_days: wishDays,
      wish_shifts: wishShifts,
      blocked_days: blockedDays,
      blocked_shifts: blockedShifts,
    });
  };

  const handleEmployeeSelect = (emp: Employee | null) => {
    setSelectedEmployee(emp);
    form.setValue('employeeKey', emp?.key || 0);
  };

  const handleCalendarDataChange = (newData: DayData[]) => {
    setCalendarData(newData);
  };

  // Calculate statistics from calendar data
  const stats = convertFromDayData(calendarData);
  const wishDaysCount = stats.wishDays.length;
  const wishShiftsCount = stats.wishShifts.length;
  const blockedDaysCount = stats.blockedDays.length;
  const blockedShiftsCount = stats.blockedShifts.length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Employee Selection */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5" />
                Mitarbeiter auswählen
              </CardTitle>
              <CardDescription>
                Suche und wähle einen Mitarbeiter aus der Mitarbeiterdatenbank
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="employeeKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mitarbeiter</FormLabel>
                    <FormControl>
                      <EmployeeSelector
                        value={field.value || undefined}
                        onSelect={handleEmployeeSelect}
                        disabled={!!employee || isSubmitting}
                      />
                    </FormControl>
                    {employee && (
                      <FormDescription>
                        Mitarbeiter können beim Bearbeiten nicht geändert werden.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{wishDaysCount}</div>
                  <div className="text-xs text-muted-foreground">Wunsch-Tage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{wishShiftsCount}</div>
                  <div className="text-xs text-muted-foreground">Wunsch-Schichten</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{blockedDaysCount}</div>
                  <div className="text-xs text-muted-foreground">Blockierte Tage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{blockedShiftsCount}</div>
                  <div className="text-xs text-muted-foreground">Blockierte Schichten</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Calendar */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarIcon className="h-5 w-5" />
                {isGlobal ? `Wochenkalender` : `Monatskalender`}
              </CardTitle>
              <CardDescription>
                Klicke auf einen Tag, um Wünsche oder Blockierungen zu verwalten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveCalendar
                month={month}
                year={year}
                categories={dayCategories}
                eventCategories={eventCategories}
                initialDayData={calendarData}
                onDayDataChange={handleCalendarDataChange}
                maxVisibleEvents={3}
                showLegend={true}
                view={isGlobal ? 'week' : 'month'}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || (!employee && !selectedEmployee)}
          >
            {isSubmitting ? 'Speichern...' : 'Speichern'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
