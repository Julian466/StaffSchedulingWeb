'use server';

import { getInjection } from '@/di/container';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { globalWishesAndBlockedRepository } from '@/features/global_wishes_and_blocked/api/global-wishes-and-blocked-repository';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export async function getAllGlobalWishesAction(caseId: number, monthYear: string): Promise<WishesAndBlockedEmployee[]> {
  const controller = getInjection('IGetAllGlobalWishesController');
  const result = await controller({ caseId, monthYear });
  if ('error' in result) throw new Error(result.error);
  return result.data;
}

export async function getGlobalWishesByKeyAction(caseId: number, monthYear: string, key: number): Promise<WishesAndBlockedEmployee | null> {
  const controller = getInjection('IGetGlobalWishesByKeyController');
  const result = await controller({ caseId, monthYear, key });
  if ('error' in result) return null;
  return result.data;
}

export async function createGlobalWishesAction(
  caseId: number,
  monthYear: string,
  data: Omit<WishesAndBlockedEmployee, 'key'>,
  options?: { skipSyncToMonthly?: boolean }
): Promise<WishesAndBlockedEmployee> {
  validateMonthYear(monthYear);
  return globalWishesAndBlockedRepository.create(data, caseId, monthYear, options);
}

export async function updateGlobalWishesAction(
  caseId: number,
  monthYear: string,
  key: number,
  data: Partial<Omit<WishesAndBlockedEmployee, 'key'>>,
  options?: { skipSyncToMonthly?: boolean }
): Promise<WishesAndBlockedEmployee> {
  validateMonthYear(monthYear);
  const result = await globalWishesAndBlockedRepository.update(key, data, caseId, monthYear, options);
  if (!result) throw new Error('Employee not found');
  return result;
}

export async function deleteGlobalWishesAction(caseId: number, monthYear: string, key: number): Promise<void> {
  const controller = getInjection('IDeleteGlobalWishesController');
  const result = await controller({ caseId, monthYear, key });
  if ('error' in result) throw new Error(result.error);
}
