/**
 * Represents a shift type in the scheduling system.
 */
export interface Shift {
  /** Unique identifier for the shift */
  id: number;
  /** Full name of the shift */
  name: string;
  /** Short abbreviation for display */
  abbreviation: string;
  /** Color code for visual representation */
  color: string;
  /** Duration in minutes */
  duration: number;
  /** Whether the shift is exclusive (only one employee can work it) */
  is_exclusive: boolean;
}

/**
 * Extended employee information for schedule display.
 * Extends the base Employee type with scheduling-specific data.
 */
export interface ScheduleEmployee {
  /** Unique identifier for the employee */
  id: number;
  /** Employee's full name */
  name: string;
  /** Employee's level/role */
  level: string;
  /** Target working time in minutes */
  target_working_time: number;
  /** Employee's wishes and preferences */
  wishes: {
    /** Array of [day, shift_abbreviation] tuples for shift preferences */
    shift_wishes: [number, string][];
    /** Array of day numbers for preferred days off */
    day_off_wishes: number[];
  };
  /** Days when employee is unavailable */
  unavailable_days?: number[];
  /** Shifts employee cannot work on specific days */
  unavailable_shifts?: Record<number, string[]>;
}

/**
 * Statistics for schedule quality analysis.
 */
export interface ScheduleStats {
  /** Number of forward rotation rule violations */
  forward_rotation_violations: number;
  /** Number of times an employee worked more than 5 consecutive days */
  consecutive_working_days_gt_5: number;
  /** Number of employees without a free weekend */
  no_free_weekend: number;
  /** Number of times an employee worked more than 3 consecutive night shifts */
  consecutive_night_shifts_gt_3: number;
  /** Total overtime hours across all employees */
  total_overtime_hours: number;
  /** Number of cases where employee didn't have free days around weekend */
  no_free_days_around_weekend: number;
  /** Number of cases where employee wasn't free 48h after night shift */
  not_free_after_night_shift: number;
  /** Total number of violated employee wishes */
  violated_wish_total: number;
}

/**
 * Complete schedule solution data.
 */
export interface ScheduleSolution {
  /** Variable assignments from optimization solver */
  variables: Record<string, number>;
  /** List of employees in the schedule */
  employees: ScheduleEmployee[];
  /** List of available shifts */
  shifts: Shift[];
  /** Array of dates in the schedule period */
  days: Date[];
  /** Schedule quality statistics */
  stats: ScheduleStats;
  /** Set of cell keys where day off wishes were fulfilled */
  fulfilledDayOffCells: Set<string>;
  /** Set of cell keys where shift wishes were fulfilled */
  fulfilledShiftWishCells: Set<string>;
  /** Set of all cell keys with day off wishes */
  allDayOffWishCells: Set<string>;
  /** Map of cell keys to shift wish colors */
  allShiftWishColors: Record<string, string[]>;
}

/**
 * Raw schedule data from API before parsing.
 */
export interface ScheduleSolutionRaw {
  variables: Record<string, number>;
  employees: ScheduleEmployee[];
  shifts: Shift[];
  days: string[];
  stats: ScheduleStats;
}

/**
 * Metadata for a single generated schedule.
 */
export interface ScheduleMetadata {
  /** Unique identifier for this schedule instance */
  scheduleId: string;
  /** Seed used to generate this schedule */
  seed: number;
  /** ISO timestamp when the schedule was generated */
  generatedAt: string;
  /** Whether this schedule is selected as the best/active one */
  isSelected: boolean;
  /** Optional user comment or notes about this schedule */
  comment?: string;
  /** Schedule quality statistics for quick comparison */
  stats: ScheduleStats;
}

/**
 * Container for all schedules of a case.
 */
export interface SchedulesMetadata {
  /** Array of all generated schedules for this case */
  schedules: ScheduleMetadata[];
  /** ID of the currently selected schedule, if any */
  selectedScheduleId: string | null;
}

/**
 * Schedule data stored in the database.
 */
export interface ScheduleDatabase {
  /** The parsed schedule solution */
  solution: ScheduleSolutionRaw | null;
}
