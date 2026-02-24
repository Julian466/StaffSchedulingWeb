'use server';

import {revalidatePath} from 'next/cache';
import {getInjection} from '@/di/container';
import {WishesAndBlockedEmployee} from '@/src/entities/models/wishes-and-blocked.model';
import {validateMonthYear} from '@/src/entities/validation/input-validators';

export async function getAllGlobalWishesAction(caseId: number, monthYear: string): Promise<WishesAndBlockedEmployee[]> {
    const controller = getInjection('IGetAllGlobalWishesController');
    const result = await controller({caseId, monthYear});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function getGlobalWishesByKeyAction(caseId: number, monthYear: string, key: number): Promise<WishesAndBlockedEmployee | null> {
    const controller = getInjection('IGetGlobalWishesByKeyController');
    const result = await controller({caseId, monthYear, key});
    if ('error' in result) return null;
    return result.data;
}

export async function createGlobalWishesAction(
    caseId: number,
    monthYear: string,
    entry: WishesAndBlockedEmployee
): Promise<void> {
    validateMonthYear(monthYear);
    const controller = getInjection('ICreateGlobalWishesController');
    const result = await controller({caseId, monthYear, entry});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/global-wishes-and-blocked');
    revalidatePath('/wishes-and-blocked');
}

export async function updateGlobalWishesAction(
    caseId: number,
    monthYear: string,
    key: number,
    data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>
): Promise<void> {
    validateMonthYear(monthYear);
    const controller = getInjection('IUpdateGlobalWishesController');
    const result = await controller({caseId, monthYear, key, data});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/global-wishes-and-blocked');
    revalidatePath('/wishes-and-blocked');
}

export async function deleteGlobalWishesAction(caseId: number, monthYear: string, key: number): Promise<void> {
    const controller = getInjection('IDeleteGlobalWishesController');
    const result = await controller({caseId, monthYear, key});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/global-wishes-and-blocked');
    revalidatePath('/wishes-and-blocked');
}

export async function importGlobalWishesTemplateAction(
    caseId: number,
    monthYear: string,
    templateId: string
): Promise<{ matchCount: number; totalCount: number; unmatchedCount: number }> {
    const controller = getInjection('IImportGlobalWishesTemplateController');
    const result = await controller({caseId, monthYear, templateId});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/global-wishes-and-blocked');
    revalidatePath('/wishes-and-blocked');
    return result.data;
}
