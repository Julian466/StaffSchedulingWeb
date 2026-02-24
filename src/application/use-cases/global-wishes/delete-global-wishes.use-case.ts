import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';

export async function deleteGlobalWishesUseCase(
  caseId: number,
  monthYear: string,
  key: number,
  globalWishesRepository: IGlobalWishesAndBlockedRepository
): Promise<void> {
  return globalWishesRepository.delete(caseId, monthYear, key);
}
