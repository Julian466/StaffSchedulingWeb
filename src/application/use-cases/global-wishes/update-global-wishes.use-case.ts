import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';

export async function updateGlobalWishesUseCase(
  caseId: number,
  monthYear: string,
  key: number,
  data: Partial<WishesAndBlockedEmployee>,
  globalWishesRepository: IGlobalWishesAndBlockedRepository
): Promise<void> {
  return globalWishesRepository.update(caseId, monthYear, key, data);
}
