import { JSONFilePreset } from 'lowdb/node';
import { GlobalWishesAndBlockedDatabase } from '@/types/wishes-and-blocked';
import { getCasePath } from '../case/db-case';
import path from 'path';

/**
 * Default data structure for a new wishes and blocked database.
 * Used when initializing a new case without existing wishes and blocked data.
 */
const defaultData: GlobalWishesAndBlockedDatabase = {
    employees: []
};

/**
 * Cache for database instances, keyed by composite key (caseId_monthYear).
 * Prevents creating multiple database connections for the same case.
 */
const dbCache = new Map<string, Awaited<ReturnType<typeof JSONFilePreset<GlobalWishesAndBlockedDatabase>>>>();

/**
 * Gets or creates a database connection for global wishes and blocked data for a specific case.
 * This database contains employee information with their wish days, wish shifts,
 * blocked days, and blocked shifts.
 * The structure is identical to the regular wishes and blocked database and only differs in its intended use case.
 * The file is not intended for a month but instead for one global week with all the wishes and blocked constraints.
 *
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format (e.g., "11_2024")
 * @returns Promise resolving to the wishes and blocked database instance
 *
 * @example
 * const db = await getGlobalWishesAndBlockedDb(77, "11_2024");
 * await db.read();
 * console.log(db.data.employees);
 */
export async function getGlobalWishesAndBlockedDb(caseId: number, monthYear: string) {
    const cacheKey = `${caseId}_${monthYear}`;
    
    // Check if we already have a cached database connection
    if (!dbCache.has(cacheKey)) {
        const casePath = getCasePath(caseId, monthYear);
        const filePath = path.join(casePath, 'global_wishes_and_blocked.json');
        const db = await JSONFilePreset<GlobalWishesAndBlockedDatabase>(filePath, defaultData);
        dbCache.set(cacheKey, db);
    }
    return dbCache.get(cacheKey)!;
}
