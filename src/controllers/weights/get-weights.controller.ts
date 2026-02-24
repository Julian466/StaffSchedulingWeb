import { getWeightsUseCase } from '@/src/application/use-cases/weights/get-weights.use-case';
import { IWeightsRepository } from '@/src/application/ports/weights.repository';
import { Weights } from '@/src/entities/models/weights.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class GetWeightsController {
  constructor(private readonly weightsRepository: IWeightsRepository) {}

  async execute(caseId: number, monthYear: string): Promise<{ data: Weights } | { error: string }> {
    try {
      const weights = await getWeightsUseCase(caseId, monthYear, this.weightsRepository);
      return { data: weights };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
