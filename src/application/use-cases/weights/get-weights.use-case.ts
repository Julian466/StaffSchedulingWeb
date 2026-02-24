import { Weights } from '@/src/entities/models/weights.model';
import { IWeightsRepository } from '@/src/application/ports/weights.repository';

export async function getWeightsUseCase(
  caseId: number,
  monthYear: string,
  weightsRepository: IWeightsRepository
): Promise<Weights> {
  return weightsRepository.get(caseId, monthYear);
}
