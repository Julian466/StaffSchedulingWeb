import { makeGetAllWishesUseCase, IGetAllWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/get-all-wishes.use-case';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetAllWishesController {
  private readonly getAllWishes: IGetAllWishesUseCase;

  constructor(wishesRepository: IWishesAndBlockedRepository) {
    this.getAllWishes = makeGetAllWishesUseCase(wishesRepository);
  }

  async execute(caseId: number, monthYear: string): Promise<{ data: WishesAndBlockedEmployee[] } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const wishes = await this.getAllWishes({ caseId, monthYear });
      return { data: wishes };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
