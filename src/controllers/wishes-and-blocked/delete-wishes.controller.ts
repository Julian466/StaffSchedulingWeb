import { makeDeleteWishesUseCase, IDeleteWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/delete-wishes.use-case';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class DeleteWishesController {
  private readonly deleteWishes: IDeleteWishesUseCase;

  constructor(wishesRepository: IWishesAndBlockedRepository) {
    this.deleteWishes = makeDeleteWishesUseCase(wishesRepository);
  }

  async execute(caseId: number, monthYear: string, key: number): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await this.deleteWishes({ caseId, monthYear, key });
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
