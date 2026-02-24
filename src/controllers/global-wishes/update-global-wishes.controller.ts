import { makeUpdateGlobalWishesUseCase, IUpdateGlobalWishesUseCase } from '@/src/application/use-cases/global-wishes/update-global-wishes.use-case';
import { IGlobalWishesAndBlockedRepository } from '@/src/application/ports/global-wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class UpdateGlobalWishesController {
  private readonly updateGlobalWishes: IUpdateGlobalWishesUseCase;

  constructor(globalWishesRepository: IGlobalWishesAndBlockedRepository) {
    this.updateGlobalWishes = makeUpdateGlobalWishesUseCase(globalWishesRepository);
  }

  async execute(caseId: number, monthYear: string, key: number, data: Partial<WishesAndBlockedEmployee>): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await this.updateGlobalWishes({ caseId, monthYear, key, data });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
