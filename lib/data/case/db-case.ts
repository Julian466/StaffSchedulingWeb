import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { CaseUnit } from '@/types/case';
import fs from 'fs/promises';
import { getCasesDirectory } from '@/lib/config/app-config';
import { parseMonthYear, formatMonthYear } from '@/lib/utils/case-utils';

/**
 * Root directory where all case data is stored.
 * Each case has its own subdirectory named by its case ID.
 * Within each case directory are month folders in MM_YYYY format.
 * The path is loaded from config.template.json.
 */
const CASES_DIR = getCasesDirectory();

/**
 * Lists all existing planning units with their available months.
 * Scans the cases directory two levels deep: unit folders and month_year subfolders.
 * 
 * @returns Promise resolving to an array of case units with available months
 * 
 * @example
 * const units = await listCases();
 * console.log(units); // [{ unitId: 77, months: ["11_2024", "12_2024"] }]
 */
export async function listCases(): Promise<CaseUnit[]> {
  try {
    // Ensure the cases directory exists
    await fs.mkdir(CASES_DIR, { recursive: true });
    const entries = await fs.readdir(CASES_DIR, { withFileTypes: true });
    
    // Filter for directories with numeric names (planning units)
    const unitDirs = entries
      .filter(entry => entry.isDirectory())
      .map(entry => parseInt(entry.name))
      .filter(id => !isNaN(id))
      .sort((a, b) => a - b);
    
    // For each unit, scan for month folders
    const caseUnits: CaseUnit[] = [];
    for (const unitId of unitDirs) {
      const unitPath = join(CASES_DIR, unitId.toString());
      const monthEntries = await fs.readdir(unitPath, { withFileTypes: true });
      
      // Filter for month folders (MM_YYYY format)
      const months = monthEntries
        .filter(entry => entry.isDirectory() && /^\d{1,2}_\d{4}$/.test(entry.name))
        .map(entry => entry.name)
        .sort();
      
      if (months.length > 0) {
        caseUnits.push({ unitId, months });
      }
    }
    
    return caseUnits;
  } catch (error) {
    return [];
  }
}

/**
 * Creates a new case with the specified planning unit, month, and year.
 * Creates the directory structure: cases/[unitId]/[MM_YYYY]/
 * 
 * @param unitId - The planning unit ID
 * @param month - Month (1-12)
 * @param year - Year (e.g., 2024)
 * @returns Promise resolving to the monthYear string
 * 
 * @example
 * const monthYear = await createCase(77, 11, 2024);
 * console.log(monthYear); // "11_2024"
 */
export async function createCase(unitId: number, month: number, year: number): Promise<string> {
  const monthYear = formatMonthYear(month, year);
  const casePath = join(CASES_DIR, unitId.toString(), monthYear);
  await fs.mkdir(casePath, { recursive: true });
  
  return monthYear;
}

/**
 * Gets the absolute file system path for a specific case directory.
 * 
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format
 * @returns The absolute path to the case directory
 * 
 * @example
 * const path = getCasePath(77, "11_2024");
 * console.log(path); // '/path/to/project/cases/77/11_2024'
 */
export function getCasePath(caseId: number, monthYear: string): string {
  return join(CASES_DIR, caseId.toString(), monthYear);
}

/**
 * Gets the absolute file path for a specific file within a case directory.
 * 
 * @param caseId - The planning unit ID
 * @param monthYear - The month/year in MM_YYYY format
 * @param filename - The name of the file
 * @returns The absolute path to the file
 * 
 * @example
 * const path = getDbFilePath(77, "11_2024", 'employees.json');
 * console.log(path); // '/path/to/project/cases/77/11_2024/employees.json'
 */
export function getDbFilePath(caseId: number, monthYear: string, filename: string): string {
  return join(CASES_DIR, caseId.toString(), monthYear, filename);
}
