'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ScheduleEmployee, Shift } from '@/types/schedule';
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

interface ScheduleTableProps {
  employees: ScheduleEmployee[];
  days: Date[];
  shifts: Shift[];
  variables: Record<string, number>;
  fulfilledDayOffCells: Set<string>;
  fulfilledShiftWishCells: Set<string>;
  allDayOffWishCells: Set<string>;
  allShiftWishColors: Record<string, string[]>;
  isFullscreen?: boolean;
}

/**
 * Displays the complete schedule in a table format.
 * Shows employees in rows, days in columns, with color-coded shift assignments.
 * Includes visual indicators for fulfilled wishes and overtime.
 */
export function ScheduleTable({
  employees,
  days,
  shifts,
  variables,
  fulfilledDayOffCells,
  fulfilledShiftWishCells,
  allDayOffWishCells,
  allShiftWishColors,
  isFullscreen = false,
}: ScheduleTableProps) {
  const [openTooltipCell, setOpenTooltipCell] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeIdentifier | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    
    const lowerSearch = searchTerm.toLowerCase();
    return employees.filter((employee) => 
      employee.name.toLowerCase().includes(lowerSearch) ||
      employee.level.toLowerCase().includes(lowerSearch) ||
      employee.id.toString().includes(lowerSearch)
    );
  }, [employees, searchTerm]);

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

      {filteredEmployees.length === 0 ? (
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
                {days.map((day, idx) => (
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
              {filteredEmployees.map((employee) => {
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
                {days.map((day, dayIdx) => {
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
                      {shiftsForCell.length > 0 || hasDayOffWish || shiftWishColors.length > 0 || shifts.some(s => unavailable(employee, dayIdx + 1, s)) ? (
                        <>
                          <div className="flex flex-col items-center gap-1 w-full">
                            {/* unavailable shift circles */}
                            <div className="flex items-center gap-1 mb-1">
                              {shifts.map((s) =>
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
                          {openTooltipCell === cellKey && (
                            <Tooltip open={true}>
                              <TooltipTrigger asChild>
                                <div className="absolute inset-0 top-8" />
                              </TooltipTrigger>
                              <TooltipContent container={isFullscreen ? containerRef.current : undefined}>
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
                                  {(hasDayOffWish || shiftWishColors.length > 0 || shifts.some(s => unavailable(employee, dayIdx + 1, s))) && shiftsForCell.length > 0 && (
                                    <div className="border-t border-border pt-1 mt-1" />
                                  )}
                                  {shifts.filter(s => unavailable(employee, dayIdx + 1, s)).map((s) => (
                                    <p key={s.id} className="text-xs">● Blockiert: {s.name}</p>
                                  ))}
                                  {hasDayOffWish && (
                                    <p className="text-xs">△ Wunsch: Freier Tag</p>
                                  )}
                                  {shiftWishColors.map((color, idx) => {
                                    const shiftForColor = shifts.find(s => s.color === color);
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
                            {shifts.map((s) =>
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
          employeeList={filteredEmployees.map(e => {
            const { firstname, lastname } = parseName(e.name);
            return {
              id: e.id,
              firstname,
              lastname
            };
          })}
          onNavigate={(emp) => setSelectedEmployee(emp)}
          container={isFullscreen ? containerRef.current : undefined}
        />
      )}
    </div>
  );
}
