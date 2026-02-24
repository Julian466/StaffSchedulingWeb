import { getAllWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/get-all-wishes.use-case';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class GetAllWishesController {
  constructor(private readonly wishesRepository: IWishesAndBlockedRepository) {}

  async execute(caseId: number, monthYear: string): Promise<{ data: WishesAndBlockedEmployee[] } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      const wishes = await getAllWishesUseCase(caseId, monthYear, this.wishesRepository);
      return { data: wishes };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
