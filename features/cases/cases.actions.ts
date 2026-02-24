'use server';

import { getInjection } from '@/di/container';
import { CaseUnit } from '@/src/entities/models/case.model';

export async function listCasesAction(): Promise<{ units: CaseUnit[] }> {
  const controller = getInjection('IListCasesController');
  const result = await controller();
  if ('error' in result) throw new Error(result.error);
  return { units: result.data };
}

export async function createCaseAction(unitId: number, month: number, year: number): Promise<{ unitId: number; monthYear: string }> {
  const controller = getInjection('ICreateCaseController');
  const result = await controller({ caseId: unitId, month, year });
  if ('error' in result) throw new Error(result.error);
  const monthYear = `${String(month).padStart(2, '0')}_${year}`;
  return { unitId, monthYear };
}
