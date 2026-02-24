import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';

export interface IUpdateGlobalWishesUseCase {
  (input: { caseId: number; monthYear: string; key: number; data: Partial<WishesAndBlockedEmployee> }): Promise<void>;
}

export function makeUpdateGlobalWishesUseCase(
  globalWishesRepository: IGlobalWishesAndBlockedRepository
): IUpdateGlobalWishesUseCase {
  return async ({ caseId, monthYear, key, data }) => {
    return globalWishesRepository.update(caseId, monthYear, key, data);
  };
}
