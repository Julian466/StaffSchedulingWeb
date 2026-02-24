import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { ResourceNotFoundError } from '@/src/entities/errors/base.errors';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';

export async function getWishesByKeyUseCase(
  caseId: number,
  monthYear: string,
  key: number,
  wishesRepository: IWishesAndBlockedRepository
): Promise<WishesAndBlockedEmployee> {
  const entry = await wishesRepository.getByKey(caseId, monthYear, key);
  if (!entry) throw new ResourceNotFoundError(`Wishes entry with key ${key} not found`);
  return entry;
}
