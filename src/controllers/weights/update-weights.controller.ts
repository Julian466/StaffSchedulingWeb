import { updateWeightsUseCase } from '@/src/application/use-cases/weights/update-weights.use-case';
import { IWeightsRepository } from '@/src/application/ports/weights.repository';
import { Weights } from '@/src/entities/models/weights.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class UpdateWeightsController {
  constructor(private readonly weightsRepository: IWeightsRepository) {}

  async execute(caseId: number, monthYear: string, weights: Weights): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await updateWeightsUseCase(caseId, monthYear, weights, this.weightsRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
