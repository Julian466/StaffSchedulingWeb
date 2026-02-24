'use server';

import { getInjection } from '@/src/di/container';
import { Weights } from '@/src/entities/models/weights.model';

export async function getWeightsAction(caseId: number, monthYear: string): Promise<Weights> {
  const controller = getInjection('GetWeightsController');
  const result = await controller({ caseId, monthYear });
  if ('error' in result) throw new Error(result.error);
  return result.data;
}

export async function updateWeightsAction(caseId: number, monthYear: string, weights: Weights): Promise<void> {
  const controller = getInjection('UpdateWeightsController');
  const result = await controller({ caseId, monthYear, weights });
  if ('error' in result) throw new Error(result.error);
}
