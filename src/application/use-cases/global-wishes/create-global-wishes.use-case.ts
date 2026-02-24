import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';

export async function createGlobalWishesUseCase(
  caseId: number,
  monthYear: string,
  entry: WishesAndBlockedEmployee,
  globalWishesRepository: IGlobalWishesAndBlockedRepository
): Promise<void> {
  return globalWishesRepository.create(caseId, monthYear, entry);
}
