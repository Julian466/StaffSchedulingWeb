import {JSONFilePreset} from 'lowdb/node';
import path from 'path';
import {GlobalWishesAndBlockedDatabase} from "@/src/entities/models";
import {getCasePath} from "@/lib/config/app-config";

export async function getGlobalWishesAndBlockedDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'global_wishes_and_blocked.json');
    return JSONFilePreset<GlobalWishesAndBlockedDatabase>(filePath, {employees: []});
}
