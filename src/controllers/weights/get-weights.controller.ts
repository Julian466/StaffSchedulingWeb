import type { IGetWeightsUseCase } from '@/src/application/use-cases/weights/get-weights.use-case';
import type { Weights } from '@/src/entities/models/weights.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export interface IGetWeightsController {
  (input: { caseId: number; monthYear: string }): Promise<
    { data: Weights } | { error: string }
  >;
}

export function makeGetWeightsController(
  getWeightsUseCase: IGetWeightsUseCase
): IGetWeightsController {
  return async ({ caseId, monthYear }) => {
    try {
      validateMonthYear(monthYear);
      const weights = await getWeightsUseCase({ caseId, monthYear });
      return { data: weights };
    } catch (error) {
      if (isDomainError(error)) return { error: error.message };
      throw error;
    }
  };
}
