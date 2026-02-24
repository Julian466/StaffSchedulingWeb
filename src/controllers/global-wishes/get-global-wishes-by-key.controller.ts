import { makeGetGlobalWishesByKeyUseCase, IGetGlobalWishesByKeyUseCase } from '@/src/application/use-cases/global-wishes/get-global-wishes-by-key.use-case';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetGlobalWishesByKeyController {
  private readonly getGlobalWishesByKey: IGetGlobalWishesByKeyUseCase;

  constructor(globalWishesRepository: IGlobalWishesAndBlockedRepository) {
    this.getGlobalWishesByKey = makeGetGlobalWishesByKeyUseCase(globalWishesRepository);
  }

  async execute(caseId: number, monthYear: string, key: number): Promise<{ data: WishesAndBlockedEmployee } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const wishes = await this.getGlobalWishesByKey({ caseId, monthYear, key });
      return { data: wishes };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
