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
 * Cache for database instances, keyed by case ID.
 * Prevents creating multiple database connections for the same case.
 */
const dbCache = new Map<number, Awaited<ReturnType<typeof JSONFilePreset<GlobalWishesAndBlockedDatabase>>>>();

/**
 * Gets or creates a database connection for global wishes and blocked data for a specific case.
 * This database contains employee information with their wish days, wish shifts,
 * blocked days, and blocked shifts.
 * The structure is identical to the regular wishes and blocked database and only differs in its intended use case.
 * The file is not intended for a month but instead for one global week with all the wishes and blocked constraints.
 *
 * @param caseId - The case ID to get the wishes and blocked database for (defaults to 1)
 * @returns Promise resolving to the wishes and blocked database instance
 *
 * @example
 * const db = await getWishesAndBlockedDb(1);
 * await db.read();
 * console.log(db.data.employees);
 */
export async function getGlobalWishesAndBlockedDb(caseId: number = 1) {
    // Check if we already have a cached database connection
    if (!dbCache.has(caseId)) {
        const casePath = getCasePath(caseId);
        const filePath = path.join(casePath, 'global_wishes_and_blocked.json');
        const db = await JSONFilePreset<GlobalWishesAndBlockedDatabase>(filePath, defaultData);
        dbCache.set(caseId, db);
    }
    return dbCache.get(caseId)!;
}
