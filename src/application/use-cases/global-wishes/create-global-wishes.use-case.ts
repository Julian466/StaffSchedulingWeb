import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';

export interface ICreateGlobalWishesUseCase {
  (input: { caseId: number; monthYear: string; entry: WishesAndBlockedEmployee }): Promise<void>;
}

export function makeCreateGlobalWishesUseCase(
  globalWishesRepository: IGlobalWishesAndBlockedRepository
): ICreateGlobalWishesUseCase {
  return async ({ caseId, monthYear, entry }) => {
    return globalWishesRepository.create(caseId, monthYear, entry);
  };
}
