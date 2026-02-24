import {JSONFilePreset} from 'lowdb/node';
import path from 'path';
import {CategoryRequirements, DayRequirements, MinimalStaffRequirements} from "@/src/entities/models";
import {getCasePath} from "@/lib/config/app-config";

/**
 * Default requirements for a single day.
 */
const defaultDayRequirements: DayRequirements = {
    F: 0,
    S: 0,
    N: 0,
};

/**
 * Default requirements for a single category across all days of the week.
 */
const defaultCategoryRequirements: CategoryRequirements = {
    Mo: {...defaultDayRequirements},
    Di: {...defaultDayRequirements},
    Mi: {...defaultDayRequirements},
    Do: {...defaultDayRequirements},
    Fr: {...defaultDayRequirements},
    Sa: {...defaultDayRequirements},
    So: {...defaultDayRequirements},
};

/**
 * Default data structure for minimal staff requirements.
 * Used when initializing a new case without existing requirements.
 */
const defaultData: MinimalStaffRequirements = {
    Fachkraft: JSON.parse(JSON.stringify(defaultCategoryRequirements)),
    Azubi: JSON.parse(JSON.stringify(defaultCategoryRequirements)),
    Hilfskraft: JSON.parse(JSON.stringify(defaultCategoryRequirements)),
};

export async function getMinimalStaffDb(caseId: number, monthYear: string) {
    const filePath = path.join(getCasePath(caseId, monthYear), 'minimal_number_of_staff.json');
    return JSONFilePreset<MinimalStaffRequirements>(filePath, defaultData);
}
