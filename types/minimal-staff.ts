/**
 * Represents shift types in the scheduling system.
 * F = Frühdienst (Early shift)
 * S = Spätdienst (Late shift)
 * N = Nachtdienst (Night shift)
 */
export type ShiftType = 'F' | 'S' | 'N';

/**
 * Represents days of the week in German abbreviation.
 */
export type WeekDay = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So';

/**
 * Represents employee categories in the system.
 */
export type EmployeeCategory = 'Fachkraft' | 'Azubi' | 'Hilfskraft';

/**
 * Minimum staff requirements for a single day.
 * Maps shift types to the minimum number of staff required.
 */
export interface DayRequirements {
  /** Minimum staff for Frühdienst (Early shift) */
  F: number;
  /** Minimum staff for Spätdienst (Late shift) */
  S: number;
  /** Minimum staff for Nachtdienst (Night shift) */
  N: number;
}

/**
 * Minimum staff requirements for a single employee category.
 * Maps days of the week to their requirements.
 */
export interface CategoryRequirements {
  Mo: DayRequirements;
  Di: DayRequirements;
  Mi: DayRequirements;
  Do: DayRequirements;
  Fr: DayRequirements;
  Sa: DayRequirements;
  So: DayRequirements;
}

/**
 * Complete minimum staff requirements data structure.
 * Maps employee categories to their weekly requirements.
 */
export interface MinimalStaffRequirements {
  Fachkraft: CategoryRequirements;
  Azubi: CategoryRequirements;
  Hilfskraft: CategoryRequirements;
}
