'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScheduleEmployee, Shift } from '@/types/schedule';
import { getShiftForCell, isWeekend, getEmployeeStats } from '@/lib/services/schedule-parser';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScheduleTableProps {
  employees: ScheduleEmployee[];
  days: Date[];
  shifts: Shift[];
  variables: Record<string, number>;
  fulfilledDayOffCells: Set<string>;
  fulfilledShiftWishCells: Set<string>;
  allDayOffWishCells: Set<string>;
  allShiftWishColors: Record<string, string[]>;
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
}: ScheduleTableProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      <div className="relative overflow-auto max-h-[800px]">
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
          {employees.map((employee) => {
            const stats = getEmployeeStats(employee, days, shifts, variables);
            return (
              <tr key={employee.id} className="group transition-colors">
                <td
                  className={cn(
                    'sticky left-0 z-20 border-b border-r border-border p-3',
                    stats.hasOvertime 
                      ? 'bg-red-50 dark:bg-red-950/40' 
                      : 'bg-card group-hover:bg-muted'
                  )}
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
                  const shift = getShiftForCell(employee.id, day, shifts, variables);
                  const dateStr = day.toISOString().split('T')[0];
                  const cellKey = `${employee.id}-${dateStr}`;

                  const isDayOffFulfilled = fulfilledDayOffCells.has(cellKey);
                  const isShiftWishFulfilled = fulfilledShiftWishCells.has(cellKey);
                  const hasDayOffWish = allDayOffWishCells.has(cellKey);
                  const shiftWishColors = allShiftWishColors[cellKey] || [];

                  return (
                    <td
                      key={dayIdx}
                      className={cn(
                        'border-b border-border p-2 text-center relative z-0',
                        isWeekend(day) && 'bg-muted/30',
                        isDayOffFulfilled && 'bg-amber-400/10',
                        isShiftWishFulfilled && 'bg-emerald-400/10',
                        !shift && !isDayOffFulfilled && hasDayOffWish && 'bg-rose-400/5'
                      )}
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {hoveredCell === cellKey && (shift || hasDayOffWish || shiftWishColors.length > 0) ? (
                        <Tooltip open>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center gap-1 w-full">
                              {(hasDayOffWish || shiftWishColors.length > 0) && (
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
                              )}

                              {shift ? (
                                <div
                                  className="rounded-md px-2 py-1.5 font-medium text-white w-full"
                                  style={{ backgroundColor: shift.color }}
                                >
                                  {shift.abbreviation}
                                </div>
                              ) : (
                                <div className="py-1.5" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm space-y-1">
                              {shift && (
                                <div>
                                  <p className="font-semibold">{shift.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Dauer: {Math.floor(shift.duration / 60)}h {shift.duration % 60}min
                                  </p>
                                </div>
                              )}
                              {(hasDayOffWish || shiftWishColors.length > 0) && shift && (
                                <div className="border-t border-border pt-1 mt-1" />
                              )}
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
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          {(hasDayOffWish || shiftWishColors.length > 0) && (
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
                          )}

                          {shift ? (
                            <div
                              className="rounded-md px-2 py-1.5 font-medium text-white w-full"
                              style={{ backgroundColor: shift.color }}
                            >
                              {shift.abbreviation}
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
  );
}
