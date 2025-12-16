/**
 * Extended employee information including wishes and blocked shifts/days.
 * Contains data about wish days, wish shifts, blocked days, and blocked shifts.
 */
export interface WishesAndBlockedEmployee {
  /** Unique identifier for the employee (references Employee.key) */
  key: number;
  /** Employee's first name */
  firstname: string;
  /** Employee's last name */
  name: string;
  /** Array of days (1-31) when the employee wishes to work or be free */
  wish_days: number[];
  /** Array of tuples containing [day, shift] for wished shifts */
  wish_shifts: [number, string][];
  /** Array of days (1-31) when the employee is blocked from working */
  blocked_days: number[];
  /** Array of tuples containing [day, shift] for blocked shifts */
  blocked_shifts: [number, string][];
}

/**
 * Database structure for storing wishes and blocked data.
 * Contains employee information with their wishes and blocked constraints.
 */
export interface WishesAndBlockedDatabase {
  /** Array of employees with their wishes and blocked data */
  employees: WishesAndBlockedEmployee[];
}

/**
 * Database structure for storing global wishes and blocked data.
 * Contains employee information with their wishes and blocked constraints.
 * The structure is identical to WishesAndBlockedDatabase.
 */
export interface GlobalWishesAndBlockedDatabase {
  /** Array of employees with their wishes and blocked data */
  employees: WishesAndBlockedEmployee[];
}
