import { Weights } from '@/src/entities/models/weights.model';
import { IWeightsRepository } from '@/src/application/ports/weights.repository';

export interface IGetWeightsUseCase {
  (input: { caseId: number; monthYear: string }): Promise<Weights>;
}

export function makeGetWeightsUseCase(
  weightsRepository: IWeightsRepository
): IGetWeightsUseCase {
  return async ({ caseId, monthYear }) => {
    return weightsRepository.get(caseId, monthYear);
  };
}
