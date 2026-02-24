import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';

export async function deleteWishesUseCase(
  caseId: number,
  monthYear: string,
  key: number,
  wishesRepository: IWishesAndBlockedRepository
): Promise<void> {
  return wishesRepository.delete(caseId, monthYear, key);
}
