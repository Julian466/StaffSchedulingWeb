import path from 'path';
import {JobHistoryData} from '@/types/solver';
import {getCasePath} from "@/lib/data/case/db-case";
import {JSONFilePreset} from "lowdb/node";

/**
 * Cache for job database instances by case ID.
 * Prevents creating multiple database connections for the same case.
 */

const defaultData: JobHistoryData = {
    jobs: []
};

const dbCache = new Map<number, Awaited<ReturnType<typeof JSONFilePreset<JobHistoryData>>>>();
/**
 * Gets or creates a database connection for job history.
 * Ensures the case directory exists and initializes default data if needed.
 *
 * This function only provides database access - CRUD operations should be
 * implemented in the repository layer (features/solver/api/job-repository.ts).
 *
 * @param caseId - The ID of the case
 * @returns Promise resolving to the job history database instance
 *
 * @example
 * const db = await getJobHistoryDb(1);
 * await db.read();
 * console.log(db.data.jobs);
 */
export async function getJobHistoryDb(caseId: number){
    // Check cache first
    if (!dbCache.has(caseId)) {
        const casePath = getCasePath(caseId);
        const webDir = path.join(casePath, 'web');
        const filePath = path.join(webDir, 'jobs.json');
        const db = await JSONFilePreset<JobHistoryData>(filePath, defaultData);
        dbCache.set(caseId, db);
    }
    return dbCache.get(caseId)!;
}

/**
 * Clears the database cache for a specific case.
 * Useful when you want to force a fresh read from disk.
 *
 * @param caseId - The case ID to clear from cache, or undefined to clear all
 */
export function clearJobCache(caseId?: number): void {
    if (caseId !== undefined) {
        dbCache.delete(caseId);
    } else {
        dbCache.clear();
    }
}
