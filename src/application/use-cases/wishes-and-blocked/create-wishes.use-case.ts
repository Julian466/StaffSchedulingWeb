import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';

export async function createWishesUseCase(
  caseId: number,
  monthYear: string,
  entry: WishesAndBlockedEmployee,
  wishesRepository: IWishesAndBlockedRepository
): Promise<void> {
  return wishesRepository.create(caseId, monthYear, entry);
}
