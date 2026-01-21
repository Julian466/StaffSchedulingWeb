/**
 * Represents a shift planning case.
 * Cases are organized by planning unit (caseId) and month/year folder structure.
 * Example folder structure: cases/77/11_2024/
 */
export interface Case {
  /** Unique identifier for the planning unit (e.g., 77 for a hospital ward) */
  caseId: number;
  /** Month and year in MM_YYYY format (e.g., "11_2024" for November 2024) */
  monthYear: string;
  /** Month of the year (1-12) */
  month: number;
  /** Year (e.g., 2024) */
  year: number;
}

/**
 * Represents available cases grouped by planning unit with their months.
 */
export interface CaseUnit {
  /** Planning unit ID */
  unitId: number;
  /** Available month folders in MM_YYYY format */
  months: string[];
}
