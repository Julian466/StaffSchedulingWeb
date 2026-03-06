import {JSONFilePreset} from 'lowdb/node';
import path from 'path';
import {getCasePath} from "@/lib/config/app-config";
import {DEFAULT_WEIGHTS, Weights} from "@/src/entities/models";

export async function getWeightsDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'weights.json');
    // Use Spread operator to create a new object based on DEFAULT_WEIGHTS, ensuring immutability
    return JSONFilePreset<Weights>(filePath, { ...DEFAULT_WEIGHTS });
}
