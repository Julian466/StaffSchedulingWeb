import { makeGetAllGlobalWishesUseCase, IGetAllGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/get-all-global-wishes.use-case';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetAllGlobalWishesController {
  private readonly getAllGlobalWishes: IGetAllGlobalWishesUseCase;

  constructor(globalWishesRepository: IGlobalWishesAndBlockedRepository) {
    this.getAllGlobalWishes = makeGetAllGlobalWishesUseCase(globalWishesRepository);
  }

  async execute(caseId: number, monthYear: string): Promise<{ data: WishesAndBlockedEmployee[] } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const wishes = await this.getAllGlobalWishes({ caseId, monthYear });
      return { data: wishes };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
