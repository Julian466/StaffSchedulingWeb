import {JSONFilePreset} from 'lowdb/node';
import path from 'path';
import {EmployeeDatabase} from "@/src/entities/models";
import {getCasePath} from "@/lib/config/app-config";

/**
 * Default data structure for a new employee database.
 * Used when initializing a new case without existing employee data.
 */
const defaultData: EmployeeDatabase = {
    employees: []
};

export async function getEmployeeDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'employees.json');
    return JSONFilePreset<EmployeeDatabase>(filePath, defaultData);
}
