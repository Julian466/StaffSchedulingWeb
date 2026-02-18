import path from 'path';
import { JobHistoryData } from '@/types/solver';
import { getCasePath } from "@/lib/data/case/db-case";
import { JSONFilePreset } from "lowdb/node";

/**
 * Cache for job database instances by case ID.
 * Prevents creating multiple database connections for the same case.
 */

const defaultData: JobHistoryData = {
    jobs: []
};

const dbCache = new Map<string, Awaited<ReturnType<typeof JSONFilePreset<JobHistoryData>>>>();
/**
 * Gets or creates a database connection for job history.
 * Ensures the case directory exists and initializes default data if needed.
 *
 * This function only provides database access - CRUD operations should be
 * implemented in the repository layer (features/solver/api/job-repository.ts).
 *
 * @param caseId - The ID of the case
 * @param monthYear - The month/year in MM_YYYY format (e.g., "11_2024")
 * @returns Promise resolving to the job history database instance
 *
 * @example
 * const db = await getJobHistoryDb(77, "11_2024");
 * await db.read();
 * console.log(db.data.jobs);
 */
export async function getJobHistoryDb(caseId: number, monthYear: string) {
    const cacheKey = `${caseId}_${monthYear}`;
    // Check cache first
    if (!dbCache.has(cacheKey)) {
        const casePath = getCasePath(caseId, monthYear);
        const webDir = path.join(casePath, 'web');
        const filePath = path.join(webDir, 'jobs.json');
        const db = await JSONFilePreset<JobHistoryData>(filePath, defaultData);
        dbCache.set(cacheKey, db);
    }
    return dbCache.get(cacheKey)!;
}

/**
 * Clears the database cache for a specific case.
 * Useful when you want to force a fresh read from disk.
 *
 * @param caseId - The case ID to clear from cache, or undefined to clear all
 */
export function clearJobCache(caseId?: number, monthYear?: string): void {
    if (caseId !== undefined && monthYear !== undefined) {
        dbCache.delete(`${caseId}_${monthYear}`);
    } else {
        dbCache.clear();
    }
}
