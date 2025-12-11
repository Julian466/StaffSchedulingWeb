'use client';

import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveCalendar, DayData } from '@/components/InteractiveCalendar';
import { User, Calendar as CalendarIcon, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishesAndBlocked } from '@/features/wishes_and_blocked/hooks/use-wishes-and-blocked';
import { useSchedule } from '@/features/schedule/hooks/use-schedule';
import { useEmployees } from '@/features/employees/hooks/use-employees';
import { useCase } from '@/components/case-provider';
import { getShiftForCell } from '@/lib/services/schedule-parser';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface EmployeeIdentifier {
  id: number;
  firstname: string;
  lastname: string;
}

interface EmployeeSummaryDialogProps {
  employee: EmployeeIdentifier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeList?: EmployeeIdentifier[]; // Liste der Mitarbeiter für Navigation
  onNavigate?: (employee: EmployeeIdentifier) => void; // Callback für Navigation
  container?: HTMLElement | null; // Container für Portal (für Fullscreen-Modus)
}

// Helper to convert wishes and blocked data to calendar format (read-only)
function convertToDayData(
  year: number,
  month: number,
  wishDays: number[],
  wishShifts: [number, string][],
  blockedDays: number[],
  blockedShifts: [number, string][]
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
        id: `${date}-wish-${shiftCode}`,
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
        id: `${date}-blocked-${shiftCode}`,
        title: shiftCode,
        categoryId: 'blocked-shift',
      }],
    });
  });

  return Array.from(dayDataMap.values());
}

export function EmployeeSummaryDialog({
  employee: targetEmployee,
  open,
  onOpenChange,
  employeeList = [],
  onNavigate,
  container,
}: EmployeeSummaryDialogProps) {
  const { caseInformation } = useCase();
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees();
  const { data: wishesAndBlockedData, isLoading: isLoadingWishes } = useWishesAndBlocked();
  const { data: scheduleData, isLoading: isLoadingSchedule } = useSchedule();
  const toastShownRef = useRef(false);
  const lastCheckedKeyRef = useRef<string | null>(null);
  
  // Helper function to match employees by ID, firstname, and lastname
  const matchEmployee = (
    id: number,
    firstname: string,
    lastname: string,
    targetId: number,
    targetFirstname: string,
    targetLastname: string
  ) => {
    return id === targetId && 
           firstname.toLowerCase().trim() === targetFirstname.toLowerCase().trim() && 
           lastname.toLowerCase().trim() === targetLastname.toLowerCase().trim();
  };

  // Find base employee data (source of truth)
  const employee = employeesData?.find((e) => 
    matchEmployee(e.key, e.firstname, e.name, targetEmployee.id, targetEmployee.firstname, targetEmployee.lastname)
  );

  // Helper to parse full name from schedule (could be "Firstname Lastname" or other formats)
  const parseScheduleName = (fullName: string): { firstname: string; lastname: string } => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return { firstname: '', lastname: '' };
    if (parts.length === 1) return { firstname: parts[0], lastname: '' };
    return {
      firstname: parts[0],
      lastname: parts.slice(1).join(' ')
    };
  };

  // Find matching employee in wishes and blocked data
  const wishesAndBlocked = employee 
    ? wishesAndBlockedData?.find((e) => 
        matchEmployee(e.key, e.firstname, e.name, employee.key, employee.firstname, employee.name)
      )
    : undefined;

  // Find matching employee in schedule data
  const scheduleEmployee = employee
    ? scheduleData?.employees.find((e) => {
        const { firstname, lastname } = parseScheduleName(e.name);
        return matchEmployee(e.id, firstname, lastname, employee.key, employee.firstname, employee.name);
      })
    : undefined;

  // Navigation logic
  const currentIndex = employeeList.findIndex(e => 
    e.id === targetEmployee.id && 
    e.firstname === targetEmployee.firstname && 
    e.lastname === targetEmployee.lastname
  );
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < employeeList.length - 1;

  const handlePrevious = () => {
    if (hasPrevious && onNavigate) {
      onNavigate(employeeList[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onNavigate) {
      onNavigate(employeeList[currentIndex + 1]);
    }
  };

  // Get year and month from case information or use current date
  const year = caseInformation?.year || new Date().getFullYear();
  const month = caseInformation?.month || new Date().getMonth() + 1;

  // Show toast notifications when data is missing
  useEffect(() => {
    if (!open) return;

    const currentKey = `${targetEmployee.id}-${targetEmployee.firstname}-${targetEmployee.lastname}`;

    // Reset toast state if we are checking a new employee (or first render)
    // This prevents duplicate toasts in Strict Mode by ensuring we only reset once per employee/session
    if (lastCheckedKeyRef.current !== currentKey) {
      toastShownRef.current = false;
      lastCheckedKeyRef.current = currentKey;
    }

    if (toastShownRef.current) return;

    // Wait for all data to finish loading before showing errors
    if (isLoadingEmployees || isLoadingWishes || isLoadingSchedule) return;

    // If employee doesn't exist in base data, show error
    if (!employee) {
      toastShownRef.current = true;
      toast.error(`Mitarbeiter nicht gefunden`, {
        description: (
          <span className="text-foreground">
            Mitarbeiter {targetEmployee.firstname} {targetEmployee.lastname} (ID: {targetEmployee.id}) wurde nicht in der Mitarbeiterdatenbank gefunden.
          </span>
        ),
        duration: 5000,
      });
      onOpenChange(false);
      return;
    }

    // Only show toast if employee exists in NEITHER wishes/blocked NOR schedule
    const notInWishes = !wishesAndBlocked;
    const notInSchedule = !scheduleEmployee;

    if (notInWishes && notInSchedule) {
      toastShownRef.current = true;
      toast.error(`Mitarbeiter nicht gefunden`, {
        description: (
          <span className="text-foreground">
            {employee.firstname} {employee.name} wurde weder in den Wünschen & Blockierungen noch im Dienstplan gefunden.
          </span>
        ),
        duration: 5000,
      });
      // Close dialog since there's no data to show
      onOpenChange(false);
    }
  }, [employee, wishesAndBlocked, scheduleEmployee, open, targetEmployee, isLoadingEmployees, isLoadingWishes, isLoadingSchedule, onOpenChange]);

  if (!employee) return null;

  // Prepare calendar data for wishes and blocked (read-only)
  const calendarData = wishesAndBlocked
    ? convertToDayData(
        year,
        month,
        wishesAndBlocked.wish_days,
        wishesAndBlocked.wish_shifts,
        wishesAndBlocked.blocked_days,
        wishesAndBlocked.blocked_shifts
      )
    : [];

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" container={container}>
        {/* Navigation Buttons */}
        {employeeList.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-50 rounded-full"
              onClick={handlePrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-50 rounded-full"
              onClick={handleNext}
              disabled={!hasNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6" />
            Mitarbeiter-Übersicht
          </DialogTitle>
          <DialogDescription>
            Vollständige Informationen zu {employee.firstname} {employee.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-1">
            <TabsTrigger value="info" className="flex items-center justify-center gap-1.5 py-3 px-2 text-xs sm:text-sm">
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate">Informationen</span>
            </TabsTrigger>
            <TabsTrigger value="wishes" className="flex items-center justify-center gap-1.5 py-3 px-2 text-xs sm:text-sm">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">Wünsche & Blockierungen</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center justify-center gap-1.5 py-3 px-2 text-xs sm:text-sm">
              <Briefcase className="h-4 w-4 shrink-0" />
              <span className="truncate">Dienstplan</span>
            </TabsTrigger>
          </TabsList>

          {/* Employee Information Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mitarbeiterinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID</p>
                    <Badge variant="outline" className="mt-1">{employee.key}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Beruf</p>
                    <p className="text-base font-medium mt-1">{employee.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vorname</p>
                    <p className="text-base font-medium mt-1">{employee.firstname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nachname</p>
                    <p className="text-base font-medium mt-1">{employee.name}</p>
                  </div>
                </div>

                {scheduleEmployee && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Ausgewählte Dienstplan-Details</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Level</p>
                        <p className="text-base font-medium">{scheduleEmployee.level}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Soll-Arbeitszeit</p>
                        <p className="text-base font-medium">
                          {(scheduleEmployee.target_working_time / 60).toFixed(1)} Stunden
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {wishesAndBlocked && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Statistik</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Wünsche</p>
                        <p className="text-base font-medium">
                          {wishesAndBlocked.wish_days.length} Tage, {wishesAndBlocked.wish_shifts.length} Schichten
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Blockierungen</p>
                        <p className="text-base font-medium">
                          {wishesAndBlocked.blocked_days.length} Tage, {wishesAndBlocked.blocked_shifts.length} Schichten
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishes & Blocked Tab */}
          <TabsContent value="wishes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wünsche und Blockierungen</CardTitle>
              </CardHeader>
              <CardContent>
                {!wishesAndBlocked ? (
                  <p className="text-center text-muted-foreground py-8">
                    Keine Daten vorhanden
                  </p>
                ) : (
                  <div className="space-y-4">
                    <InteractiveCalendar
                      month={month}
                      year={year}
                      categories={dayCategories}
                      eventCategories={eventCategories}
                      initialDayData={calendarData}
                      onDayDataChange={() => {}} // Read-only
                      showLegend={true}
                      readOnly={true}
                      container={container}
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Diese Ansicht ist schreibgeschützt. Änderungen können auf der Wünsche & Blockierungen Seite vorgenommen werden.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aktueller Dienstplan</CardTitle>
              </CardHeader>
              <CardContent>
                {!scheduleData || !scheduleEmployee ? (
                  <p className="text-center text-muted-foreground py-8">
                    Kein Dienstplan verfügbar
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr>
                          <th className="border-b border-border p-3 text-left font-semibold">
                            Datum
                          </th>
                          <th className="border-b border-border p-3 text-center font-semibold">
                            Schicht
                          </th>
                          <th className="border-b border-border p-3 text-center font-semibold">
                            Dauer
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduleData.days.map((day, idx) => {
                          const shift = getShiftForCell(
                            scheduleEmployee.id,
                            day,
                            scheduleData.shifts,
                            scheduleData.variables
                          );
                          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                          return (
                            <tr
                              key={idx}
                              className={cn(
                                'border-b',
                                isWeekend && 'bg-muted/30'
                              )}
                            >
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">
                                    {day.toLocaleDateString('de-DE', {
                                      weekday: 'short',
                                      day: '2-digit',
                                      month: '2-digit',
                                    })}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                {shift ? (
                                  <div
                                    className="inline-block rounded-md px-3 py-1.5 font-medium text-white"
                                    style={{ backgroundColor: shift.color }}
                                  >
                                    {shift.abbreviation}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Frei</span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                {shift ? (
                                  <span className="text-sm">
                                    {Math.floor(shift.duration / 60)}h {shift.duration % 60}min
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
