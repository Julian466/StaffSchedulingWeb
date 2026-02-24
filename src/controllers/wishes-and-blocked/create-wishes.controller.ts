import { makeCreateWishesUseCase, ICreateWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/create-wishes.use-case';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class CreateWishesController {
  private readonly createWishes: ICreateWishesUseCase;

  constructor(wishesRepository: IWishesAndBlockedRepository) {
    this.createWishes = makeCreateWishesUseCase(wishesRepository);
  }

  async execute(caseId: number, monthYear: string, entry: WishesAndBlockedEmployee): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await this.createWishes({ caseId, monthYear, entry });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
