import { makeGetWeightsUseCase, IGetWeightsUseCase } from '@/src/application/use-cases/weights/get-weights.use-case';
import { IWeightsRepository } from '@/src/application/ports/weights.repository';
import { Weights } from '@/src/entities/models/weights.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetWeightsController {
  private readonly getWeights: IGetWeightsUseCase;

  constructor(weightsRepository: IWeightsRepository) {
    this.getWeights = makeGetWeightsUseCase(weightsRepository);
  }

  async execute(caseId: number, monthYear: string): Promise<{ data: Weights } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const weights = await this.getWeights({ caseId, monthYear });
      return { data: weights };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
