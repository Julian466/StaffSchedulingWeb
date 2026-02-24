import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';

export async function getAllGlobalWishesUseCase(
  caseId: number,
  monthYear: string,
  globalWishesRepository: IGlobalWishesAndBlockedRepository
): Promise<WishesAndBlockedEmployee[]> {
  return globalWishesRepository.getAll(caseId, monthYear);
}
