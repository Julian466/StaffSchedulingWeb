'use server';

import {revalidatePath} from 'next/cache';
import {getInjection} from '@/di/container';
import {WishesAndBlockedEmployee} from '@/src/entities/models/wishes-and-blocked.model';

export async function getAllWishesAction(caseId: number, monthYear: string): Promise<WishesAndBlockedEmployee[]> {
    const controller = getInjection('IGetAllWishesController');
    const result = await controller({caseId, monthYear});
    if ('error' in result) throw new Error(result.error);
    return result.data;
}

export async function getWishesByKeyAction(caseId: number, monthYear: string, key: number): Promise<WishesAndBlockedEmployee | null> {
    const controller = getInjection('IGetWishesByKeyController');
    const result = await controller({caseId, monthYear, key});
    if ('error' in result) return null;
    return result.data;
}

export async function createWishesAction(caseId: number, monthYear: string, data: Omit<WishesAndBlockedEmployee, 'key'>): Promise<WishesAndBlockedEmployee> {
    const controller = getInjection('ICreateWishesController');
    const result = await controller({caseId, monthYear, entry: data as WishesAndBlockedEmployee});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/wishes-and-blocked');
    return data as WishesAndBlockedEmployee;
}

export async function updateWishesAction(caseId: number, monthYear: string, key: number, data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>): Promise<WishesAndBlockedEmployee> {
    const controller = getInjection('IUpdateWishesController');
    const result = await controller({caseId, monthYear, key, data});
    if ('error' in result) throw new Error(result.error);
    // Fetch updated entity
    const getController = getInjection('IGetWishesByKeyController');
    const getResult = await getController({caseId, monthYear, key});
    revalidatePath('/wishes-and-blocked');
    if ('data' in getResult) return getResult.data;
    return data as WishesAndBlockedEmployee;
}

export async function deleteWishesAction(caseId: number, monthYear: string, key: number): Promise<void> {
    const controller = getInjection('IDeleteWishesController');
    const result = await controller({caseId, monthYear, key});
    if ('error' in result) throw new Error(result.error);
    revalidatePath('/wishes-and-blocked');
}
