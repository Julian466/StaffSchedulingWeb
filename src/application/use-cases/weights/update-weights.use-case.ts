import { Weights } from '@/src/entities/models/weights.model';
import { IWeightsRepository } from '@/src/application/ports/weights.repository';

export async function updateWeightsUseCase(
  caseId: number,
  monthYear: string,
  weights: Weights,
  weightsRepository: IWeightsRepository
): Promise<void> {
  return weightsRepository.update(caseId, monthYear, weights);
}
