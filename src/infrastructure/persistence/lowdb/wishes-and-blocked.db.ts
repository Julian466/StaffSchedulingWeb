import {JSONFilePreset} from 'lowdb/node';
import path from 'path';
import {getCasePath} from "@/lib/config/app-config";
import {WishesAndBlockedDatabase} from "@/src/entities/models";

export async function getWishesAndBlockedDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'wishes_and_blocked.json');
    return JSONFilePreset<WishesAndBlockedDatabase>(filePath, {employees: []});
}
