'use server';

import {getInjection} from '@/di/container';
import {MinimalStaffRequirements} from '@/src/entities/models/minimal-staff.model';

export async function getMinimalStaffAction(caseId: number, monthYear: string): Promise<MinimalStaffRequirements> {
    const controller = getInjection('IGetMinimalStaffController');
    const result = await controller({caseId, monthYear});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function updateMinimalStaffAction(caseId: number, monthYear: string, requirements: MinimalStaffRequirements): Promise<void> {
    const controller = getInjection('IUpdateMinimalStaffController');
    const result = await controller({caseId, monthYear, data: requirements});
    if ('error' in result) throw new Error(result.error);
}
