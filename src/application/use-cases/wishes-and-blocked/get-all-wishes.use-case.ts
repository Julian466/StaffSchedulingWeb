import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';

export async function getAllWishesUseCase(
  caseId: number,
  monthYear: string,
  wishesRepository: IWishesAndBlockedRepository
): Promise<WishesAndBlockedEmployee[]> {
  return wishesRepository.getAll(caseId, monthYear);
}
