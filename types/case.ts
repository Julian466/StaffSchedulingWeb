/**
 * Metadata about a shift planning case.
 * Each case represents a specific month and year for which shifts are being planned.
 */
export interface CaseInformation {
  /** Unique identifier for the case */
  caseId: number;
  /** Month of the year (1-12) */
  month: number;
  /** Year (e.g., 2025) */
  year: number;
  /** ISO timestamp when the case was created */
  createdAt?: string;
  /** ISO timestamp when the case was last updated */
  updatedAt?: string;
}

/**
 * Represents a shift planning case.
 * Cases are used to organize and manage shift data for specific time periods.
 */
export interface Case {
  /** Unique identifier for the case */
  id: number;
  /** Optional metadata about the case */
  information?: CaseInformation;
}
