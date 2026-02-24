import { getGlobalWishesByKeyUseCase } from '@/src/application/use-cases/global-wishes/get-global-wishes-by-key.use-case';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';

export class GetGlobalWishesByKeyController {
  constructor(private readonly globalWishesRepository: IGlobalWishesAndBlockedRepository) {}

  async execute(caseId: number, monthYear: string, key: number): Promise<{ data: WishesAndBlockedEmployee } | { error: string }> {
    try {
      const wishes = await getGlobalWishesByKeyUseCase(caseId, monthYear, key, this.globalWishesRepository);
      return { data: wishes };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
