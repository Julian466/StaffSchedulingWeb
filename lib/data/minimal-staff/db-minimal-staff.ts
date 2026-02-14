import { JSONFilePreset } from 'lowdb/node';
import { MinimalStaffRequirements, CategoryRequirements, DayRequirements } from '@/types/minimal-staff';
import { getCasePath } from '../case/db-case';
import path from 'path';

/**
 * Default requirements for a single day.
 */
const defaultDayRequirements: DayRequirements = {
  F: 0,
  S: 0,
  N: 0,
};

/**
 * Default requirements for a single category across all days of the week.
 */
const defaultCategoryRequirements: CategoryRequirements = {
  Mo: { ...defaultDayRequirements },
  Di: { ...defaultDayRequirements },
  Mi: { ...defaultDayRequirements },
  Do: { ...defaultDayRequirements },
  Fr: { ...defaultDayRequirements },
  Sa: { ...defaultDayRequirements },
  So: { ...defaultDayRequirements },
};

/**
 * Default data structure for minimal staff requirements.
 * Used when initializing a new case without existing requirements.
 */
const defaultData: MinimalStaffRequirements = {
  Fachkraft: JSON.parse(JSON.stringify(defaultCategoryRequirements)),
  Azubi: JSON.parse(JSON.stringify(defaultCategoryRequirements)),
  Hilfskraft: JSON.parse(JSON.stringify(defaultCategoryRequirements)),
};

/**
 * Cache for database instances, keyed by composite key (caseId_monthYear).
 * Prevents creating multiple database connections for the same case.
 */
const dbCache = new Map<string, Awaited<ReturnType<typeof JSONFilePreset<MinimalStaffRequirements>>>>();

/**
 * Gets or creates a database connection for minimal staff requirements for a specific case.
 * Uses caching to avoid creating multiple connections to the same database file.
 * 
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format (e.g., "11_2024")
 * @returns Promise resolving to the minimal staff requirements database instance
 * 
 * @example
 * const db = await getMinimalStaffDb(77, "11_2024");
 * await db.read();
 * console.log(db.data.Fachkraft.Mo.F);
 */
export async function getMinimalStaffDb(caseId: number, monthYear: string) {
  const cacheKey = `${caseId}_${monthYear}`;
  
  // Check if we already have a cached database connection
  if (!dbCache.has(cacheKey)) {
    const casePath = getCasePath(caseId, monthYear);
    const filePath = path.join(casePath, 'minimal_number_of_staff.json');
    const db = await JSONFilePreset<MinimalStaffRequirements>(filePath, defaultData);
    dbCache.set(cacheKey, db);
  }
  return dbCache.get(cacheKey)!;
}
