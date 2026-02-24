import {JSONFilePreset} from 'lowdb/node';
import path from 'path';
import {getCasePath} from "@/lib/config/app-config";
import {WishesAndBlockedDatabase} from "@/src/entities/models";


/**
 * Default data structure for a new wishes and blocked database.
 * Used when initializing a new case without existing wishes and blocked data.
 */
const defaultData: WishesAndBlockedDatabase = {
    employees: []
};

export async function getWishesAndBlockedDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'wishes_and_blocked.json');
    return JSONFilePreset<WishesAndBlockedDatabase>(filePath, defaultData);
}
