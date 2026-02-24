import path from 'path';
import {JSONFilePreset} from 'lowdb/node';
import fs from 'fs/promises';
import {getCasePath} from '@/lib/config/app-config';
import {ScheduleDatabase, SchedulesMetadata} from "@/src/entities/models";

/**
 * Gets or creates a database connection for schedule metadata.
 * Manages the list of all schedules for a case.
 *
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format
 * @returns Promise resolving to the schedules metadata database instance
 */
export async function getSchedulesMetadataDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'web', 'schedules.json');
    return JSONFilePreset<SchedulesMetadata>(filePath, {schedules: [], selectedScheduleId: null});
}

/**
 * Gets or creates a database connection for a specific schedule solution.
 * Each schedule is stored in its own file named schedule_{scheduleId}.json
 *
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format
 * @param scheduleId - The ID of the specific schedule
 * @returns Promise resolving to the schedule database instance
 */
export async function getScheduleDb(caseId: number, monthYear: string, scheduleId: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'web', `schedule_${scheduleId}.json`);
    return JSONFilePreset<ScheduleDatabase>(filePath, {solution: null});
}

/**
 * Deletes a specific schedule file.
 *
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format
 * @param scheduleId - The ID of the schedule to delete
 */
export async function deleteSchedule(caseId: number, monthYear: string, scheduleId: string): Promise<void> {
    const filePath = path.join(getCasePath(caseId, monthYear), 'web', `schedule_${scheduleId}.json`);
    try {
        await fs.unlink(filePath);
    } catch (error) {
        // File might not exist, ignore error
    }
}
