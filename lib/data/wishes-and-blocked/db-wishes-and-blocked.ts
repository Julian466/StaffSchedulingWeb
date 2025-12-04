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
 * Cache for database instances, keyed by case ID.
 * Prevents creating multiple database connections for the same case.
 */
const dbCache = new Map<number, Awaited<ReturnType<typeof JSONFilePreset<WishesAndBlockedDatabase>>>>();

/**
 * Gets or creates a database connection for wishes and blocked data for a specific case.
 * This database contains employee information with their wish days, wish shifts,
 * blocked days, and blocked shifts.
 * 
 * @param caseId - The case ID to get the wishes and blocked database for (defaults to 1)
 * @returns Promise resolving to the wishes and blocked database instance
 * 
 * @example
 * const db = await getWishesAndBlockedDb(1);
 * await db.read();
 * console.log(db.data.employees);
 */
export async function getWishesAndBlockedDb(caseId: number = 1) {
  // Check if we already have a cached database connection
  if (!dbCache.has(caseId)) {
    const casePath = getCasePath(caseId);
    const filePath = path.join(casePath, 'wishes_and_blocked.json');
    const db = await JSONFilePreset<WishesAndBlockedDatabase>(filePath, defaultData);
    dbCache.set(caseId, db);
  }
  return dbCache.get(caseId)!;
}
