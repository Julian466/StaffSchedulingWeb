import { JSONFilePreset } from 'lowdb/node';
import { Weights, DEFAULT_WEIGHTS } from '@/types/weights';
import { getCasePath } from '../case/db-case';
import path from 'path';

/**
 * Cache for database instances, keyed by composite key (caseId_monthYear).
 * Prevents creating multiple database connections for the same case.
 */
const dbCache = new Map<string, Awaited<ReturnType<typeof JSONFilePreset<Weights>>>>();

/**
 * Gets or creates a database connection for weights for a specific case.
 * Uses caching to avoid creating multiple connections to the same database file.
 * 
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format (e.g., "11_2024")
 * @returns Promise resolving to the weights database instance
 * 
 * @example
 * const db = await getWeightsDb(77, "11_2024");
 * await db.read();
 * console.log(db.data.wishes);
 */
export async function getWeightsDb(caseId: number, monthYear: string) {
  const cacheKey = `${caseId}_${monthYear}`;
  
  // Check if we already have a cached database connection
  if (!dbCache.has(cacheKey)) {
    const casePath = getCasePath(caseId, monthYear);
    const filePath = path.join(casePath, 'weights.json');
    const db = await JSONFilePreset<Weights>(filePath, DEFAULT_WEIGHTS);
    dbCache.set(cacheKey, db);
  }
  return dbCache.get(cacheKey)!;
}
