import { updateWishesUseCase } from '@/src/application/use-cases/wishes-and-blocked/update-wishes.use-case';
import { IWishesAndBlockedRepository } from '@/src/application/ports/wishes-and-blocked.repository';
import { WishesAndBlockedEmployee } from '@/src/entities/models/wishes-and-blocked.model';
import { isDomainError } from '@/src/entities/errors/base.errors';
import { validateMonthYear } from '@/src/entities/validation/input-validators';

export class UpdateWishesController {
  constructor(private readonly wishesRepository: IWishesAndBlockedRepository) {}

  async execute(caseId: number, monthYear: string, key: number, data: Partial<WishesAndBlockedEmployee>): Promise<{ data: void } | { error: string }> {
    try {
      validateMonthYear(monthYear);
      await updateWishesUseCase(caseId, monthYear, key, data, this.wishesRepository);
      return { data: undefined };
    } catch (error) {
      if (isDomainError(error)) {
        return { error: error.message };
      }
      throw error;
    }
  }
}
