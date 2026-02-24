import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { ResourceNotFoundError } from '@/src/entities/errors/base.errors';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';

export async function getGlobalWishesByKeyUseCase(
  caseId: number,
  monthYear: string,
  key: number,
  globalWishesRepository: IGlobalWishesAndBlockedRepository
): Promise<WishesAndBlockedEmployee> {
  const entry = await globalWishesRepository.getByKey(caseId, monthYear, key);
  if (!entry) throw new ResourceNotFoundError(`Global wishes entry with key ${key} not found`);
  return entry;
}
