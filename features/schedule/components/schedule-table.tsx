'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ScheduleEmployee, Shift, ScheduleSolution } from '@/types/schedule';
import { getShiftsForCell, isWeekend, getEmployeeStats } from '@/lib/services/schedule-parser';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { EmployeeSummaryDialog, EmployeeIdentifier } from '@/components/employee-summary-dialog';

interface SingleScheduleTableProps {
  employees: ScheduleEmployee[];
  days: Date[];
  shifts: Shift[];
  variables: Record<string, number>;
  fulfilledDayOffCells: Set<string>;
  fulfilledShiftWishCells: Set<string>;
  allDayOffWishCells: Set<string>;
  allShiftWishColors: Record<string, string[]>;
  isFullscreen?: boolean;
  compareMode?: false;
}

interface CompareScheduleTableProps {
  schedules: (ScheduleSolution & { scheduleId: string; seed: number })[];
  compareMode: true;
  isFullscreen?: boolean;
}

type ScheduleTableProps = SingleScheduleTableProps | CompareScheduleTableProps;

/**
 * Displays the complete schedule in a table format.
 * Shows employees in rows, days in columns, with color-coded shift assignments.
 * Includes visual indicators for fulfilled wishes and overtime.
 * In compare mode, groups employees from different schedules.
 */
export function ScheduleTable(props: ScheduleTableProps) {
  const [openTooltipCell, setOpenTooltipCell] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeIdentifier | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | undefined>(undefined);

  const isFullscreen = props.isFullscreen ?? false;
  const compareMode = props.compareMode ?? false;

  useEffect(() => {
    if (isFullscreen && containerRef.current) {
      setPortalContainer(containerRef.current);
    } else {
      setPortalContainer(undefined);
    }
  }, [isFullscreen]);

  const parseName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return { firstname: '', lastname: '' };
    if (parts.length === 1) return { firstname: parts[0], lastname: '' };
    return {
      firstname: parts[0],
      lastname: parts.slice(1).join(' ')
    };
  };

  const handleMouseLeave = useCallback(() => {
    setOpenTooltipCell(null);
  }, []);

  const handleCellClick = useCallback((cellKey: string) => {
    setOpenTooltipCell(cellKey);
  }, []);

  // Check if employee is unavailable for a day/shift
  const unavailable = (employee: ScheduleEmployee, day: number, shift?: Shift) => {
    if (!shift) {
      return (
        employee.vacation_days.includes(day) ||
        employee.forbidden_days.includes(day)
      );
    }
    return (
      employee.vacation_shifts.some(
        ([d, s]: [number, string]) => d === day && s === shift.abbreviation
      ) ||
      employee.forbidden_shifts.some(
        ([d, s]: [number, string]) => d === day && s === shift.abbreviation
      )
    );
  };

  // Extract common data based on mode
  const { employees, days, shifts, variables, fulfilledDayOffCells, fulfilledShiftWishCells, allDayOffWishCells, allShiftWishColors } = useMemo(() => {
    if (compareMode && 'schedules' in props) {
      // In compare mode, use data from first schedule for structure
      const firstSchedule = props.schedules[0];
      return {
        employees: firstSchedule.employees,
        days: firstSchedule.days,
        shifts: firstSchedule.shifts,
        variables: firstSchedule.variables,
        fulfilledDayOffCells: firstSchedule.fulfilledDayOffCells,
        fulfilledShiftWishCells: firstSchedule.fulfilledShiftWishCells,
        allDayOffWishCells: firstSchedule.allDayOffWishCells,
        allShiftWishColors: firstSchedule.allShiftWishColors,
      };
    } else if (!compareMode && 'employees' in props) {
      return {
        employees: props.employees,
        days: props.days,
        shifts: props.shifts,
        variables: props.variables,
        fulfilledDayOffCells: props.fulfilledDayOffCells,
        fulfilledShiftWishCells: props.fulfilledShiftWishCells,
        allDayOffWishCells: props.allDayOffWishCells,
        allShiftWishColors: props.allShiftWishColors,
      };
    }
    // Fallback (should never happen)
    return {
      employees: [],
      days: [],
      shifts: [],
      variables: {},
      fulfilledDayOffCells: new Set<string>(),
      fulfilledShiftWishCells: new Set<string>(),
      allDayOffWishCells: new Set<string>(),
      allShiftWishColors: {},
    };
  }, [compareMode, props]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    
    const lowerSearch = searchTerm.toLowerCase();
    return employees.filter((employee: ScheduleEmployee) => 
      employee.name.toLowerCase().includes(lowerSearch) ||
      employee.level.toLowerCase().includes(lowerSearch) ||
      employee.id.toString().includes(lowerSearch)
    );
  }, [employees, searchTerm]);

  // Group employees by ID for compare mode
  const groupedEmployees = useMemo(() => {
    if (!compareMode || !('schedules' in props)) return [];
    
    const schedules = props.schedules;
    const employeeMap = new Map<number, ScheduleEmployee[]>();
    
    // Group all employees by their ID
    schedules.forEach((schedule: ScheduleSolution & { scheduleId: string; seed: number }) => {
      schedule.employees.forEach((employee: ScheduleEmployee) => {
        if (!employeeMap.has(employee.id)) {
          employeeMap.set(employee.id, []);
        }
        employeeMap.get(employee.id)!.push(employee);
      });
    });
    
    // Convert to array of groups, filtering by search
    const groups: { employee: ScheduleEmployee; scheduleId: string; seed: number; scheduleData: ScheduleSolution & { scheduleId: string; seed: number } }[][] = [];
    
    employeeMap.forEach((employees, employeeId) => {
      const firstEmployee = employees[0];
      if (!searchTerm || 
          firstEmployee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          firstEmployee.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
          firstEmployee.id.toString().includes(searchTerm)) {
        
        const group = schedules.map((schedule: ScheduleSolution & { scheduleId: string; seed: number }, _idx: number) => {
          const employee = schedule.employees.find((e: ScheduleEmployee) => e.id === employeeId);
          return {
            employee: employee!,
            scheduleId: schedule.scheduleId,
            seed: schedule.seed,
            scheduleData: schedule,
          };
        }).filter((item: { employee: ScheduleEmployee; scheduleId: string; seed: number; scheduleData: ScheduleSolution & { scheduleId: string; seed: number } }) => item.employee);
        
        groups.push(group);
      }
    });
    
    return groups;
  }, [compareMode, props, searchTerm]);

  if (compareMode && 'schedules' in props && (!props.schedules || props.schedules.length === 0)) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Keine Dienstpläne zum Vergleichen ausgewählt.
      </div>
    );
  }

  return (
    <div className={cn(isFullscreen && "h-full flex flex-col")} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Suche nach Name, Level oder ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {compareMode ? (
        groupedEmployees.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Keine Mitarbeiter gefunden.
          </div>
        ) : (
          <TooltipProvider delayDuration={300} skipDelayDuration={100}>
            <div className={cn(
              "relative overflow-auto",
              isFullscreen ? "flex-1" : "max-h-[800px]"
            )}>
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-20 bg-card">
                  <tr>
                    <th className="sticky left-0 z-30 min-w-40 border-b border-r border-border bg-card p-3 text-left font-semibold text-foreground">
                      Employee / Dienstplan
                    </th>
                    {days.map((day: Date, idx: number) => (
                      <th
                        key={idx}
                        className={cn(
                          'border-b border-border p-3 text-center font-medium text-foreground min-w-[100px]',
                          isWeekend(day) && 'bg-muted/30'
                        )}
                      >
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {day.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {day.toLocaleDateString('de-DE', { weekday: 'short' })}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupedEmployees.map((group, groupIdx) => (
                    <React.Fragment key={`group-${group[0]?.employee.id || groupIdx}`}>
                      {group.map((item, itemIdx) => {
                        const { employee, scheduleId, seed, scheduleData } = item;
                        const stats = getEmployeeStats(employee, scheduleData.days, scheduleData.shifts, scheduleData.variables);
                        const isFirstInGroup = itemIdx === 0;
                        const isLastInGroup = itemIdx === group.length - 1;
                        
                        return (
                          <tr 
                            key={`${employee.id}-${scheduleId}`} 
                            className={cn(
                              "transition-colors",
                              !isLastInGroup && "border-b-0"
                            )}
                          >
                            <td
                              className={cn(
                                'sticky left-0 z-20 border-r border-border p-3 cursor-pointer',
                                stats.hasOvertime 
                                  ? 'bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60' 
                                  : 'bg-card',
                                isLastInGroup ? 'border-b' : 'border-b-0'
                              )}
                              onClick={() => {
                                const { firstname, lastname } = parseName(employee.name);
                                setSelectedEmployee({
                                  id: employee.id,
                                  firstname,
                                  lastname
                                });
                              }}
                            >
                              <div className="space-y-1">
                                {isFirstInGroup && (
                                  <>
                                    <div className="font-medium text-foreground">{employee.name}</div>
                                    <div className="text-xs text-muted-foreground">{employee.level}</div>
                                  </>
                                )}
                                <div className={cn("text-xs font-semibold", isFirstInGroup && "mt-2", "text-blue-600 dark:text-blue-400")}>
                                  Seed {seed}
                                </div>
                                <div className="text-xs">
                                  <div className="text-muted-foreground">{stats.totalShifts} Schichten</div>
                                  <div
                                    className={cn(
                                      'font-medium',
                                      stats.hasOvertime ? 'text-destructive' : 'text-muted-foreground'
                                    )}
                                  >
                                    {stats.actualHours.toFixed(1)}h / {stats.targetHours.toFixed(1)}h
                                  </div>
                                </div>
                              </div>
                            </td>
                            {scheduleData.days.map((day: Date, dayIdx: number) => {
                              const shiftsForCell = getShiftsForCell(employee.id, day, scheduleData.shifts, scheduleData.variables);
                              const dateStr = day.toISOString().split('T')[0];
                              const cellKey = `${employee.id}-${scheduleId}-${dateStr}`;

                              const isDayOffFulfilled = scheduleData.fulfilledDayOffCells.has(`${employee.id}-${dateStr}`);
                              const isShiftWishFulfilled = scheduleData.fulfilledShiftWishCells.has(`${employee.id}-${dateStr}`);
                              const hasDayOffWish = scheduleData.allDayOffWishCells.has(`${employee.id}-${dateStr}`);
                              const shiftWishColors = scheduleData.allShiftWishColors[`${employee.id}-${dateStr}`] || [];

                              const isUnavailable = unavailable(employee, dayIdx + 1);

                              return (
                                <td
                                  key={dayIdx}
                                  className={cn(
                                    'p-2 text-center relative z-0 cursor-pointer hover:bg-foreground/5',
                                    isWeekend(day) && 'bg-muted/30 hover:bg-muted/90',
                                    isDayOffFulfilled && 'bg-amber-400/10 hover:bg-amber-400/25',
                                    isShiftWishFulfilled && 'bg-emerald-400/10 hover:bg-emerald-400/25',
                                    isUnavailable && 'bg-rose-400/10 hover:bg-rose-400/25',
                                    !shiftsForCell.length && !isDayOffFulfilled && hasDayOffWish && 'bg-rose-400/5 hover:bg-rose-400/20',
                                    isLastInGroup ? 'border-b border-border' : 'border-b-0'
                                  )}
                                  onMouseLeave={() => handleMouseLeave()}
                                  onClick={() => handleCellClick(cellKey)}
                                >
                                  {shiftsForCell.length > 0 ? (
                                    <div className="flex flex-col w-full gap-1">
                                      {shiftsForCell.map((shift) => (
                                        <div
                                          key={shift.id}
                                          className="rounded-md px-2 py-1.5 font-medium text-white w-full"
                                          style={{ backgroundColor: shift.color }}
                                        >
                                          {shift.name}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="py-1.5" />
                                  )}
                                  
                                  {openTooltipCell === cellKey && (
                                    <Tooltip open={true}>
                                      <TooltipTrigger asChild>
                                        <div className="absolute inset-0 top-8" />
                                      </TooltipTrigger>
                                      <TooltipContent container={portalContainer}>
                                        <div className="text-sm space-y-1">
                                          {shiftsForCell.length > 0 && (
                                            <div className="space-y-1">
                                              {shiftsForCell.map((shift) => (
                                                <div key={shift.id}>
                                                  <p className="font-semibold">{shift.name}</p>
                                                  <p className="text-xs text-muted-foreground">
                                                    Dauer: {Math.floor(shift.duration / 60)}h {shift.duration % 60}min
                                                  </p>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </TooltipProvider>
        )
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Keine Mitarbeiter gefunden.
        </div>
      ) : (
        <TooltipProvider delayDuration={300} skipDelayDuration={100}>
          <div className={cn(
            "relative overflow-auto",
            isFullscreen ? "flex-1" : "max-h-[800px]"
          )}>
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-card">
              <tr>
                <th className="sticky left-0 z-30 min-w-40 border-b border-r border-border bg-card p-3 text-left font-semibold text-foreground">
                  Employee
                </th>
                {days.map((day: Date, idx: number) => (
                  <th
                    key={idx}
                    className={cn(
                      'border-b border-border p-3 text-center font-medium text-foreground min-w-[100px]',
                      isWeekend(day) && 'bg-muted/30'
                    )}
                  >
                    <div className="space-y-1">
                      <div className="font-semibold">
                        {day.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.toLocaleDateString('de-DE', { weekday: 'short' })}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee: ScheduleEmployee) => {
                const stats = getEmployeeStats(employee, days, shifts, variables);
            return (
              <tr key={employee.id} className="transition-colors">
                <td
                  className={cn(
                    'sticky left-0 z-20 border-b border-r border-border p-3 cursor-pointer',
                    stats.hasOvertime 
                      ? 'bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60' 
                      : 'bg-card'
                  )}
                  onClick={() => {
                    const { firstname, lastname } = parseName(employee.name);
                    setSelectedEmployee({
                      id: employee.id,
                      firstname,
                      lastname
                    });
                  }}
                >
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{employee.name}</div>
                    <div className="text-xs text-muted-foreground">{employee.level}</div>
                    <div className="mt-2 text-xs">
                      <div className="text-muted-foreground">{stats.totalShifts} Schichten</div>
                      <div
                        className={cn(
                          'font-medium',
                          stats.hasOvertime ? 'text-destructive' : 'text-muted-foreground'
                        )}
                      >
                        {stats.actualHours.toFixed(1)}h / {stats.targetHours.toFixed(1)}h
                      </div>
                    </div>
                  </div>
                </td>
                {days.map((day: Date, dayIdx: number) => {
                  const shiftsForCell = getShiftsForCell(employee.id, day, shifts, variables);
                  const dateStr = day.toISOString().split('T')[0];
                  const cellKey = `${employee.id}-${dateStr}`;

                  const isDayOffFulfilled = fulfilledDayOffCells.has(cellKey);
                  const isShiftWishFulfilled = fulfilledShiftWishCells.has(cellKey);
                  const hasDayOffWish = allDayOffWishCells.has(cellKey);
                  const shiftWishColors = allShiftWishColors[cellKey] || [];

                  const isUnavailable = unavailable(employee, dayIdx + 1);

                  return (
                    <td
                      key={dayIdx}
                      className={cn(
                      // Standard-Basis: Wenn keine Farbe aktiv ist, greift dieser graue Hover
                      'border-b border-border p-2 text-center relative z-0 cursor-pointer hover:bg-foreground/5',

                      // Wochenende: Leicht dunkleres Grau beim Hover
                      isWeekend(day) && 'bg-muted/30 hover:bg-muted/90',

                      // Urlaub erfüllt (Amber): Bleibt Amber, wird intensiver
                      isDayOffFulfilled && 'bg-amber-400/10 hover:bg-amber-400/25',

                      // Wunsch erfüllt (Emerald): Bleibt Emerald, wird intensiver
                      isShiftWishFulfilled && 'bg-emerald-400/10 hover:bg-emerald-400/25',

                      // Nicht verfügbar (Rose): Bleibt Rot, wird intensiver
                      isUnavailable && 'bg-rose-400/10 hover:bg-rose-400/25',

                      // Wunsch offen (Rose): Bleibt Rot, wird intensiver
                      !shiftsForCell.length && !isDayOffFulfilled && hasDayOffWish && 'bg-rose-400/5 hover:bg-rose-400/20'
                    )}
                      onMouseLeave={() => handleMouseLeave()}
                      onClick={() => handleCellClick(cellKey)}
                    >
                      {shiftsForCell.length > 0 || hasDayOffWish || shiftWishColors.length > 0 || shifts.some((s: Shift) => unavailable(employee, dayIdx + 1, s)) ? (
                        <>
                          <div className="flex flex-col items-center gap-1 w-full">
                            {/* unavailable shift circles */}
                            <div className="flex items-center gap-1 mb-1">
                              {shifts.map((s: Shift) =>
                                unavailable(employee, dayIdx + 1, s) ? (
                                  <div
                                    key={s.id}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: s.color }}
                                  />
                                ) : null
                              )}
                            </div>

                            {/* day-off wish + shift wish icons */}
                            <div className="flex items-center gap-1 mb-1">
                              {hasDayOffWish && (
                                <div
                                  className="w-0 h-0 border-l-4 border-r-4 border-b-[6px]"
                                  style={{
                                    borderLeftColor: 'transparent',
                                    borderRightColor: 'transparent',
                                    borderBottomColor: '#b77c02',
                                  }}
                                />
                              )}
                              {shiftWishColors.map((color: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="w-2 h-2"
                                  style={{
                                    backgroundColor: color,
                                    transform: 'rotate(45deg)',
                                  }}
                                />
                              ))}
                            </div>

                            {/* RENDER ALL SHIFTS FOR THIS CELL */}
                            {shiftsForCell.length > 0 ? (
                              <div className="flex flex-col w-full gap-1">
                                {shiftsForCell.map((shift) => (
                                  <div
                                    key={shift.id}
                                    className="rounded-md px-2 py-1.5 font-medium text-white w-full"
                                    style={{ backgroundColor: shift.color }}
                                  >
                                    {shift.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="py-1.5" />
                            )}
                          </div>
                          {openTooltipCell === cellKey && (
                            <Tooltip open={true}>
                              <TooltipTrigger asChild>
                                <div className="absolute inset-0 top-8" />
                              </TooltipTrigger>
                              <TooltipContent container={portalContainer}>
                                <div className="text-sm space-y-1">
                                  {shiftsForCell.length > 0 && (
                                    <div className="space-y-1">
                                      {shiftsForCell.map((shift) => (
                                        <div key={shift.id}>
                                          <p className="font-semibold">{shift.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            Dauer: {Math.floor(shift.duration / 60)}h {shift.duration % 60}min
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {(hasDayOffWish || shiftWishColors.length > 0 || shifts.some((s: Shift) => unavailable(employee, dayIdx + 1, s))) && shiftsForCell.length > 0 && (
                                    <div className="border-t border-border pt-1 mt-1" />
                                  )}
                                  {shifts.filter((s: Shift) => unavailable(employee, dayIdx + 1, s)).map((s: Shift) => (
                                    <p key={s.id} className="text-xs">● Blockiert: {s.name}</p>
                                  ))}
                                  {hasDayOffWish && (
                                    <p className="text-xs">△ Wunsch: Freier Tag</p>
                                  )}
                                  {shiftWishColors.map((color: string, idx: number) => {
                                    const shiftForColor = shifts.find((s: Shift) => s.color === color);
                                    return (
                                      <p key={idx} className="text-xs">
                                        ◆ Schichtwunsch: {shiftForColor?.name || 'Unbekannt'}
                                      </p>
                                    );
                                  })}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          {/* unavailable shift circles */}
                          <div className="flex items-center gap-1 mb-1">
                            {shifts.map((s: Shift) =>
                              unavailable(employee, dayIdx + 1, s) ? (
                                <div
                                  key={s.id}
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: s.color }}
                                />
                              ) : null
                            )}
                          </div>

                          {/* day-off wish + shift wish icons */}
                          <div className="flex items-center gap-1 mb-1">
                            {hasDayOffWish && (
                              <div
                                className="w-0 h-0 border-l-4 border-r-4 border-b-[6px]"
                                style={{
                                  borderLeftColor: 'transparent',
                                  borderRightColor: 'transparent',
                                  borderBottomColor: '#b77c02',
                                }}
                              />
                            )}
                            {shiftWishColors.map((color, idx) => (
                              <div
                                key={idx}
                                className="w-2 h-2"
                                style={{
                                  backgroundColor: color,
                                  transform: 'rotate(45deg)',
                                }}
                              />
                            ))}
                          </div>

                          {/* RENDER ALL SHIFTS FOR THIS CELL */}
                          {shiftsForCell.length > 0 ? (
                            <div className="flex flex-col w-full gap-1">
                              {shiftsForCell.map((shift) => (
                                <div
                                  key={shift.id}
                                  className="rounded-md px-2 py-1.5 font-medium text-white w-full"
                                  style={{ backgroundColor: shift.color }}
                                >
                                  {shift.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-1.5" />
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </TooltipProvider>
      )}

      {selectedEmployee && (
        <EmployeeSummaryDialog
          employee={selectedEmployee}
          open={!!selectedEmployee}
          onOpenChange={(open) => !open && setSelectedEmployee(null)}
          employeeList={filteredEmployees.map((e: ScheduleEmployee) => {
            const { firstname, lastname } = parseName(e.name);
            return {
              id: e.id,
              firstname,
              lastname
            };
          })}
          onNavigate={(emp) => setSelectedEmployee(emp)}
          container={portalContainer}
        />
      )}
    </div>
  );
}
