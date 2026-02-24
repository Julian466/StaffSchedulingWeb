'use server';

import { getInjection } from '@/src/di/container';
import { MinimalStaffRequirements } from '@/src/entities/models/minimal-staff.model';

export async function getMinimalStaffAction(caseId: number, monthYear: string): Promise<MinimalStaffRequirements> {
  const controller = getInjection('GetMinimalStaffController');
  const result = await controller.execute(caseId, monthYear);
  if ('error' in result) throw new Error(result.error);
  return result.data;
}

export async function updateMinimalStaffAction(caseId: number, monthYear: string, requirements: MinimalStaffRequirements): Promise<void> {
  const controller = getInjection('UpdateMinimalStaffController');
  const result = await controller.execute(caseId, monthYear, requirements);
  if ('error' in result) throw new Error(result.error);
}
