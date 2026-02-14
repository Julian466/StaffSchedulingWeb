import { JSONFilePreset } from 'lowdb/node';
import { WishesAndBlockedDatabase } from '@/types/wishes-and-blocked';
import { getCasePath } from '../case/db-case';
import path from 'path';

/**
 * Default data structure for a new wishes and blocked database.
 * Used when initializing a new case without existing wishes and blocked data.
 */
const defaultData: WishesAndBlockedDatabase = {
  employees: []
};

/**
 * Cache for database instances, keyed by composite key (caseId_monthYear).
 * Prevents creating multiple database connections for the same case.
 */
const dbCache = new Map<string, Awaited<ReturnType<typeof JSONFilePreset<WishesAndBlockedDatabase>>>>();

/**
 * Gets or creates a database connection for wishes and blocked data for a specific case.
 * This database contains employee information with their wish days, wish shifts,
 * blocked days, and blocked shifts.
 * 
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format (e.g., "11_2024")
 * @returns Promise resolving to the wishes and blocked database instance
 * 
 * @example
 * const db = await getWishesAndBlockedDb(77, "11_2024");
 * await db.read();
 * console.log(db.data.employees);
 */
export async function getWishesAndBlockedDb(caseId: number, monthYear: string) {
  const cacheKey = `${caseId}_${monthYear}`;
  
  // Check if we already have a cached database connection
  if (!dbCache.has(cacheKey)) {
    const casePath = getCasePath(caseId, monthYear);
    const filePath = path.join(casePath, 'wishes_and_blocked.json');
    const db = await JSONFilePreset<WishesAndBlockedDatabase>(filePath, defaultData);
    dbCache.set(cacheKey, db);
  }
  return dbCache.get(cacheKey)!;
}
