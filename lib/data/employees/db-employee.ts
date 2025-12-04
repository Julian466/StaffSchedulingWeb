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
 * Cache for database instances, keyed by case ID.
 * Prevents creating multiple database connections for the same case.
 */
const dbCache = new Map<number, Awaited<ReturnType<typeof JSONFilePreset<EmployeeDatabase>>>>();

/**
 * Gets or creates a database connection for employee data for a specific case.
 * Uses caching to avoid creating multiple connections to the same database file.
 * 
 * @param caseId - The case ID to get the employee database for (defaults to 1)
 * @returns Promise resolving to the employee database instance
 * 
 * @example
 * const db = await getEmployeeDb(1);
 * await db.read();
 * console.log(db.data.employees);
 */
export async function getEmployeeDb(caseId: number = 1) {
  // Check if we already have a cached database connection
  if (!dbCache.has(caseId)) {
    const casePath = getCasePath(caseId);
    const filePath = path.join(casePath, 'employees.json');
    const db = await JSONFilePreset<EmployeeDatabase>(filePath, defaultData);
    dbCache.set(caseId, db);
  }
  return dbCache.get(caseId)!;
}
