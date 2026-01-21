import { JSONFilePreset } from 'lowdb/node';
import { EmployeeDatabase } from '@/types/employee';
import { getCasePath } from '../case/db-case';
import path from 'path';

/**
 * Default data structure for a new employee database.
 * Used when initializing a new case without existing employee data.
 */
const defaultData: EmployeeDatabase = {
  employees: []
};

/**
 * Cache for database instances, keyed by composite key (caseId_monthYear).
 * Prevents creating multiple database connections for the same case.
 */
const dbCache = new Map<string, Awaited<ReturnType<typeof JSONFilePreset<EmployeeDatabase>>>>();

/**
 * Gets or creates a database connection for employee data for a specific case.
 * Uses caching to avoid creating multiple connections to the same database file.
 * 
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format (e.g., "11_2024")
 * @returns Promise resolving to the employee database instance
 * 
 * @example
 * const db = await getEmployeeDb(77, "11_2024");
 * await db.read();
 * console.log(db.data.employees);
 */
export async function getEmployeeDb(caseId: number, monthYear: string) {
  const cacheKey = `${caseId}_${monthYear}`;
  
  // Check if we already have a cached database connection
  if (!dbCache.has(cacheKey)) {
    const casePath = getCasePath(caseId, monthYear);
    const filePath = path.join(casePath, 'employees.json');
    const db = await JSONFilePreset<EmployeeDatabase>(filePath, defaultData);
    dbCache.set(cacheKey, db);
  }
  return dbCache.get(cacheKey)!;
}
