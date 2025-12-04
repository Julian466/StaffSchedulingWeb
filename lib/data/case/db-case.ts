import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { CaseInformation } from '@/types/case';
import fs from 'fs/promises';
import { getCasesDirectory } from '@/lib/config/app-config';

/**
 * Data structure for case information stored in the database.
 */
interface CaseInfoData {
  information: CaseInformation;
}

/**
 * Root directory where all case data is stored.
 * Each case has its own subdirectory named by its case ID.
 * The path is loaded from config.json.
 */
const CASES_DIR = getCasesDirectory();

/**
 * Gets or creates a database connection for case information.
 * Ensures the case directory exists and initializes default data if needed.
 * 
 * @param caseId - The ID of the case to get information for
 * @returns Promise resolving to the case information database instance
 * 
 * @example
 * const db = await getCaseInformationDb(1);
 * await db.read();
 * console.log(db.data.information.month);
 */
export async function getCaseInformationDb(caseId: number) {
  const caseDir = join(CASES_DIR, caseId.toString());
  const file = join(caseDir, 'case_information.json');
  
  // Ensure case directory exists before creating database connection
  await fs.mkdir(caseDir, { recursive: true });
  
  const adapter = new JSONFile<CaseInfoData>(file);
  // Set up default data with current date/time
  const defaultData: CaseInfoData = {
    information: {
      caseId,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  };
  const db = new Low(adapter, defaultData);
  
  await db.read();
  
  // Initialize with default data if file doesn't exist or is empty
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
  
  return db;
}

/**
 * Lists all existing case IDs by scanning the cases directory.
 * Returns case IDs sorted in ascending order.
 * 
 * @returns Promise resolving to an array of case IDs
 * 
 * @example
 * const cases = await listCases();
 * console.log('Available cases:', cases); // [1, 2, 3]
 */
export async function listCases(): Promise<number[]> {
  try {
    // Ensure the cases directory exists
    await fs.mkdir(CASES_DIR, { recursive: true });
    const entries = await fs.readdir(CASES_DIR, { withFileTypes: true });
    
    // Filter for directories with numeric names
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => parseInt(entry.name))
      .filter(id => !isNaN(id))
      .sort((a, b) => a - b);
  } catch (error) {
    return [];
  }
}

/**
 * Creates a new case with a unique ID and initializes its directory structure.
 * The new case ID is determined by incrementing the highest existing case ID.
 * 
 * @returns Promise resolving to the newly created case ID
 * 
 * @example
 * const newCaseId = await createCase();
 * console.log('Created case:', newCaseId); // 4
 */
export async function createCase(): Promise<number> {
  const existingCases = await listCases();
  // Generate new case ID by incrementing the highest existing ID
  const newCaseId = existingCases.length > 0 ? Math.max(...existingCases) + 1 : 1;
  
  const caseDir = join(CASES_DIR, newCaseId.toString());
  await fs.mkdir(caseDir, { recursive: true });
  
  // Initialize the case with default case_information.json
  await getCaseInformationDb(newCaseId);
  
  return newCaseId;
}

/**
 * Gets the absolute file system path for a specific case directory.
 * 
 * @param caseId - The ID of the case
 * @returns The absolute path to the case directory
 * 
 * @example
 * const path = getCasePath(1);
 * console.log(path); // '/path/to/project/cases/1'
 */
export function getCasePath(caseId: number): string {
  return join(CASES_DIR, caseId.toString());
}

/**
 * Gets the absolute file path for a specific file within a case directory.
 * 
 * @param caseId - The ID of the case
 * @param filename - The name of the file
 * @returns The absolute path to the file
 * 
 * @example
 * const path = getDbFilePath(1, 'schedule.json');
 * console.log(path); // '/path/to/project/cases/1/schedule.json'
 */
export function getDbFilePath(caseId: number, filename: string): string {
  return join(CASES_DIR, caseId.toString(), filename);
}
