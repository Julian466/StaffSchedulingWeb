import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { SchedulesMetadata, ScheduleSolutionRaw, ScheduleDatabase } from '@/types/schedule';
import fs from 'fs/promises';
import { getCasesDirectory } from '@/lib/config/app-config';

/**
 * Root directory where all case data is stored.
 * The path is loaded from config.json.
 */
const CASES_DIR = getCasesDirectory();

/**
 * Gets or creates a database connection for schedule metadata.
 * Manages the list of all schedules for a case.
 * 
 * @param caseId - The ID of the case
 * @returns Promise resolving to the schedules metadata database instance
 */
export async function getSchedulesMetadataDb(caseId: number) {
  const caseDir = join(CASES_DIR, caseId.toString());
  const file = join(caseDir, 'schedules.json');
  
  await fs.mkdir(caseDir, { recursive: true });
  
  const adapter = new JSONFile<SchedulesMetadata>(file);
  const defaultData: SchedulesMetadata = {
    schedules: [],
    selectedScheduleId: null,
  };
  const db = new Low(adapter, defaultData);
  
  await db.read();
  
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
  
  return db;
}

/**
 * Gets or creates a database connection for a specific schedule solution.
 * Each schedule is stored in its own file named schedule_{scheduleId}.json
 * 
 * @param caseId - The ID of the case
 * @param scheduleId - The ID of the specific schedule
 * @returns Promise resolving to the schedule database instance
 */
export async function getScheduleDb(caseId: number, scheduleId: string) {
  const caseDir = join(CASES_DIR, caseId.toString());
  const file = join(caseDir, `schedule_${scheduleId}.json`);
  
  await fs.mkdir(caseDir, { recursive: true });
  
  const adapter = new JSONFile<ScheduleDatabase>(file);
  const defaultData: ScheduleDatabase = {
    solution: null,
  };
  const db = new Low(adapter, defaultData);
  
  await db.read();
  
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
  
  return db;
}

/**
 * Lists all schedule files for a given case.
 * 
 * @param caseId - The ID of the case
 * @returns Promise resolving to an array of schedule IDs
 */
export async function listScheduleIds(caseId: number): Promise<string[]> {
  try {
    const caseDir = join(CASES_DIR, caseId.toString());
    await fs.mkdir(caseDir, { recursive: true });
    const files = await fs.readdir(caseDir);
    
    // Filter for schedule files: schedule_*.json
    return files
      .filter(file => file.startsWith('schedule_') && file.endsWith('.json'))
      .map(file => file.replace('schedule_', '').replace('.json', ''));
  } catch (error) {
    return [];
  }
}

/**
 * Deletes a specific schedule file.
 * 
 * @param caseId - The ID of the case
 * @param scheduleId - The ID of the schedule to delete
 */
export async function deleteSchedule(caseId: number, scheduleId: string): Promise<void> {
  const caseDir = join(CASES_DIR, caseId.toString());
  const file = join(caseDir, `schedule_${scheduleId}.json`);
  
  try {
    await fs.unlink(file);
  } catch (error) {
    // File might not exist, ignore error
  }
}
