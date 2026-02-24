import {JSONFilePreset} from 'lowdb/node';
import path from 'path';
import {EmployeeDatabase} from "@/src/entities/models";
import {getCasePath} from "@/lib/config/app-config";

export async function getEmployeeDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'employees.json');
    return JSONFilePreset<EmployeeDatabase>(filePath, {employees: []});
}
