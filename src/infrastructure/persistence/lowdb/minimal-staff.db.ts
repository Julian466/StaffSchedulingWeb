import {JSONFilePreset} from 'lowdb/node';
import path from 'path';
import {CategoryRequirements, DayRequirements, MinimalStaffRequirements} from "@/src/entities/models";
import {getCasePath} from "@/lib/config/app-config";

/**
 * Default requirements for a single day.
 */
const getDefaultDayRequirements = (): DayRequirements => ({
    F: 0,
    S: 0,
    N: 0,
});

/**
 * Default requirements for a single category across all days of the week.
 */
const getDefaultCategoryRequirements = (): CategoryRequirements => ({
    Mo: getDefaultDayRequirements(),
    Di: getDefaultDayRequirements(),
    Mi: getDefaultDayRequirements(),
    Do: getDefaultDayRequirements(),
    Fr: getDefaultDayRequirements(),
    Sa: getDefaultDayRequirements(),
    So: getDefaultDayRequirements(),
});

/**
 * Factory function for default minimal staff requirements.
 * Used when initializing a new case without existing requirements.
 * Always returns a fresh, deep-copied object.
 */
const getDefaultData = (): MinimalStaffRequirements => ({
    Fachkraft: getDefaultCategoryRequirements(),
    Azubi: getDefaultCategoryRequirements(),
    Hilfskraft: getDefaultCategoryRequirements(),
});

export async function getMinimalStaffDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'minimal_number_of_staff.json');
    return JSONFilePreset<MinimalStaffRequirements>(filePath, getDefaultData());
}
