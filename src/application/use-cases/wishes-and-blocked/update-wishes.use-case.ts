import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';

export async function updateWishesUseCase(
  caseId: number,
  monthYear: string,
  key: number,
  data: Partial<WishesAndBlockedEmployee>,
  wishesRepository: IWishesAndBlockedRepository
): Promise<void> {
  return wishesRepository.update(caseId, monthYear, key, data);
}
