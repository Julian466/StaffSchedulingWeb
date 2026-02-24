'use server';

import { getInjection } from '@/src/di/container';
import { CaseUnit } from '@/src/entities/models/case.model';

export async function listCasesAction(): Promise<{ units: CaseUnit[] }> {
  const controller = getInjection('ListCasesController');
  const result = await controller({});
  if ('error' in result) throw new Error(result.error);
  return { units: result.data };
}

export async function createCaseAction(unitId: number, month: number, year: number): Promise<{ unitId: number; monthYear: string }> {
  const controller = getInjection('CreateCaseController');
  const result = await controller({ caseId: unitId, month, year });
  if ('error' in result) throw new Error(result.error);
  const monthYear = `${String(month).padStart(2, '0')}_${year}`;
  return { unitId, monthYear };
}
