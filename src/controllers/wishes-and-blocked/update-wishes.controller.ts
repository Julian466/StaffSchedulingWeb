import { makeUpdateWishesUseCase, IUpdateWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/update-wishes.use-case';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class UpdateWishesController {
  private readonly updateWishes: IUpdateWishesUseCase;

  constructor(wishesRepository: IWishesAndBlockedRepository) {
    this.updateWishes = makeUpdateWishesUseCase(wishesRepository);
  }

  async execute(caseId: number, monthYear: string, key: number, data: Partial<WishesAndBlockedEmployee>): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await this.updateWishes({ caseId, monthYear, key, data });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
