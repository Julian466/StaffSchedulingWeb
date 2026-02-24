'use server';

import { getInjection } from '@/src/di/container';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';

export async function getAllGlobalWishesAction(caseId: number, monthYear: string): Promise<WishesAndBlockedEmployee[]> {
  const controller = getInjection('GetAllGlobalWishesController');
  const result = await controller.execute(caseId, monthYear);
  if ('error' in result) throw new Error(result.error);
  return result.data;
}

export async function getGlobalWishesByKeyAction(caseId: number, monthYear: string, key: number): Promise<WishesAndBlockedEmployee | null> {
  const controller = getInjection('GetGlobalWishesByKeyController');
  const result = await controller.execute(caseId, monthYear, key);
  if ('error' in result) return null;
  return result.data;
}

export async function createGlobalWishesAction(caseId: number, monthYear: string, data: Omit<WishesAndBlockedEmployee, 'key'>): Promise<WishesAndBlockedEmployee> {
  const controller = getInjection('CreateGlobalWishesController');
  const result = await controller.execute(caseId, monthYear, data as WishesAndBlockedEmployee);
  if ('error' in result) throw new Error(result.error);
  return data as WishesAndBlockedEmployee;
}

export async function updateGlobalWishesAction(caseId: number, monthYear: string, key: number, data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>): Promise<WishesAndBlockedEmployee> {
  const controller = getInjection('UpdateGlobalWishesController');
  const result = await controller.execute(caseId, monthYear, key, data);
  if ('error' in result) throw new Error(result.error);
  // Fetch updated entity
  const getController = getInjection('GetGlobalWishesByKeyController');
  const getResult = await getController.execute(caseId, monthYear, key);
  if ('data' in getResult) return getResult.data;
  return data as WishesAndBlockedEmployee;
}

export async function deleteGlobalWishesAction(caseId: number, monthYear: string, key: number): Promise<void> {
  const controller = getInjection('DeleteGlobalWishesController');
  const result = await controller.execute(caseId, monthYear, key);
  if ('error' in result) throw new Error(result.error);
}
